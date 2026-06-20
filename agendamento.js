// =========================================================
// AGENDAMENTO PSICOLÓGICO — lógica da Tela 2
// =========================================================

// Dados simulados da psicóloga (futuramente vindos de uma API)
const psicologa = {
  nome: "Ludimila Rocha da Silveira",
  email: "ludimila@inatel.br",
  iniciais: "LS"
};

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// ---------- Configuração do calendário ----------
const TOTAL_DIAS = 30; // o mês é sempre exibido com 30 dias, conforme solicitado

const hoje = new Date();
const diaHoje = hoje.getDate();

let dataSelecionada = null; // nenhum dia selecionado por padrão — usuário precisa escolher
let horarioSelecionado = null;

// Um dia fica desabilitado se: já passou (antes de hoje) OU cai em sábado/domingo
function diaEstaDesabilitado(dia) {
  if (dia < diaHoje) return true;

  const diaSemana = new Date(hoje.getFullYear(), hoje.getMonth(), dia).getDay();
  const isFimDeSemana = diaSemana === 0 || diaSemana === 6; // 0 = domingo, 6 = sábado
  return isFimDeSemana;
}

// Formata a data selecionada no padrão DD/MM/AAAA (mesmo formato usado pela API)
function formatarDataSelecionada() {
  return `${String(dataSelecionada).padStart(2, "0")}/${String(hoje.getMonth() + 1).padStart(2, "0")}/${hoje.getFullYear()}`;
}

// ---------- Horários ----------
// A lista de horários disponíveis agora vem da API (GET /api/horarios-disponiveis),
// que já considera quais horários estão ocupados naquela data específica.
let horariosCarregados = [];

// ---------- Renderização ----------
function montarLabelMes() {
  const label = document.getElementById("mesAnoLabel");
  label.innerText = `Selecionar Data — ${nomesMeses[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

function renderCalendario() {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  // Descobre em qual dia da semana o dia 1 do mês cai (0 = domingo ... 6 = sábado)
  const primeiroDiaSemana = new Date(hoje.getFullYear(), hoje.getMonth(), 1).getDay();

  // Preenche células vazias antes do dia 1, para alinhar com o cabeçalho de dias da semana
  for (let i = 0; i < primeiroDiaSemana; i++) {
    const vazio = document.createElement("div");
    vazio.classList.add("cal-day", "empty");
    grid.appendChild(vazio);
  }

  for (let dia = 1; dia <= TOTAL_DIAS; dia++) {
    const div = document.createElement("div");
    div.classList.add("cal-day");
    div.innerText = dia;

    const desabilitado = diaEstaDesabilitado(dia);

    if (desabilitado) {
      div.classList.add("disabled");
    } else {
      if (dia === dataSelecionada) {
        div.classList.add("selected");
      }
      div.addEventListener("click", () => {
        dataSelecionada = dia;
        horarioSelecionado = null; // troca de data zera o horário escolhido antes
        renderCalendario();
        mostrarHorarios();
      });
    }

    grid.appendChild(div);
  }
}

function renderHorarios() {
  const grid = document.getElementById("timesGrid");
  grid.innerHTML = "";

  if (horariosCarregados.length === 0) {
    grid.innerHTML = `<p style="margin:0 5px; font-size:11px; color:#999;">Nenhum horário disponível para esta data.</p>`;
    return;
  }

  horariosCarregados.forEach(horario => {
    const btn = document.createElement("button");
    btn.classList.add("time-btn");
    btn.innerText = horario;

    if (horario === horarioSelecionado) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      horarioSelecionado = horario;
      renderHorarios();
    });

    grid.appendChild(btn);
  });
}

/**
 * Busca na API quais horários ainda estão livres para a data selecionada.
 * GET /api/horarios-disponiveis?data=DD/MM/AAAA
 */
async function buscarHorariosDisponiveis() {
  const grid = document.getElementById("timesGrid");
  grid.innerHTML = `<p style="margin:0 5px; font-size:11px; color:#999;">Carregando horários...</p>`;

  try {
    const dataFormatada = formatarDataSelecionada();
    const resposta = await fetch(`${API_BASE_URL}/api/horarios-disponiveis?data=${dataFormatada}`);

    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}`);
    }

    const dados = await resposta.json();
    horariosCarregados = dados.horariosDisponiveis;
    renderHorarios();
  } catch (erro) {
    console.error("Erro ao buscar horários disponíveis:", erro);
    grid.innerHTML = `<p style="margin:0 5px; font-size:11px; color:#c0392b;">Não foi possível carregar os horários. A API está rodando?</p>`;
  }
}

function mostrarHorarios() {
  const container = document.getElementById("horariosContainer");
  container.style.display = "block";
  buscarHorariosDisponiveis();
}

function verHorarios() {
  if (!dataSelecionada) {
    alert("Selecione uma data primeiro para ver os horários disponíveis.");
    return;
  }
  document.getElementById("horariosContainer").scrollIntoView({ behavior: "smooth", block: "center" });
}

async function confirmarConsulta() {
  if (!dataSelecionada && !horarioSelecionado) {
    alert("Selecione uma data e um horário antes de confirmar.");
    return;
  }

  if (!dataSelecionada) {
    alert("Selecione uma data antes de confirmar.");
    return;
  }

  if (!horarioSelecionado) {
    alert("Selecione um horário antes de confirmar.");
    return;
  }

  const consulta = {
    psicologa: psicologa.nome,
    psicologaEmail: psicologa.email,
    psicologaIniciais: psicologa.iniciais,
    data: formatarDataSelecionada(),
    horario: horarioSelecionado,
    status: "AGENDADA"
  };

  let consultaCriada;

  try {
    const resposta = await fetch(`${API_BASE_URL}/api/consultas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consulta)
    });

    const dadosResposta = await resposta.json();

    if (!resposta.ok) {
      // A API responde 409 quando já existe consulta nesse dia/horário (corrida entre duas pessoas, por exemplo)
      alert(dadosResposta.erro || "Não foi possível confirmar a consulta. Tente novamente.");
      return;
    }

    consultaCriada = dadosResposta; // já vem com o "id" gerado pelo banco de dados
  } catch (erro) {
    console.error("Erro ao confirmar consulta:", erro);
    alert("Não foi possível conectar à API. Verifique se o backend está rodando.");
    return;
  }

  // Mantém a chave "ultimaConsulta" só como ponte local entre esta página e a Tela 3
  // (a Tela 3 mostra o resumo logo após a confirmação; ela não precisa buscar da API).
  localStorage.setItem("ultimaConsulta", JSON.stringify(consultaCriada));

  // ---------- Agendamento das notificações (30/15/5 min antes) ----------
  // Pedir permissão pode abrir um popup do navegador na primeira vez, o que
  // depende do usuário interagir. Para não travar o redirecionamento caso o
  // usuário demore (ou nunca) a responder, usamos um tempo limite de segurança:
  // se a permissão não for decidida em 3 segundos, seguimos sem notificações
  // (o usuário ainda pode aceitar depois e o agendamento é tentado novamente
  // a cada carregamento de página, via GerenciadorNotificacoes.reagendarPendentes).
  const [horas, minutos] = horarioSelecionado.split(":").map(Number);
  const dataHoraConsulta = new Date(hoje.getFullYear(), hoje.getMonth(), dataSelecionada, horas, minutos);

  const comTimeout = (promessa, ms) => Promise.race([
    promessa,
    new Promise(resolve => setTimeout(() => resolve(false), ms))
  ]);

  try {
    const permissaoConcedida = await comTimeout(GerenciadorNotificacoes.pedirPermissao(), 3000);
    if (permissaoConcedida) {
      GerenciadorNotificacoes.agendarParaConsulta(dataHoraConsulta, psicologa.nome);
    } else {
      console.warn("Permissão de notificação não concedida (ou não respondida a tempo). Os lembretes não serão exibidos agora.");
    }
  } catch (erro) {
    console.error("Erro ao configurar notificações:", erro);
  }

  window.location.href = "confirmacao.html";
}

document.addEventListener("DOMContentLoaded", () => {
  montarLabelMes();
  renderCalendario();
});