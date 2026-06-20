const psicologa = {
  nome: "Ludimila Rocha da Silveira",
  email: "ludimila@inatel.br",
  iniciais: "LS"
};

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const TOTAL_DIAS = 30; 

const hoje = new Date();
const diaHoje = hoje.getDate();

let dataSelecionada = null; // nenhum dia selecionado por padrão, usuário precisa escolher
let horarioSelecionado = null;

// Um dia fica desabilitado se já passou (antes de hoje) ou cai em sábado/domingo
function diaEstaDesabilitado(dia) {
  if (dia < diaHoje) return true;

  const diaSemana = new Date(hoje.getFullYear(), hoje.getMonth(), dia).getDay();
  const isFimDeSemana = diaSemana === 0 || diaSemana === 6; // 0 = domingo, 6 = sábado
  return isFimDeSemana;
}

// configuração dos horários 
function gerarHorarios() {
  const horarios = [];
  const inicio = 9 * 60;       // 09:00 em minutos
  const fim = 16 * 60;         // 16:00 em minutos
  const almocoInicio = 12 * 60;     // 12:00
  const almocoFim = 13 * 60 + 30;   // 13:30

  for (let minutos = inicio; minutos <= fim; minutos += 30) {
    if (minutos >= almocoInicio && minutos < almocoFim) continue; // pula o intervalo de almoço

    const h = String(Math.floor(minutos / 60)).padStart(2, "0");
    const m = String(minutos % 60).padStart(2, "0");
    horarios.push(`${h}:${m}`);
  }
  return horarios;
}

const horariosDisponiveis = gerarHorarios();

function montarLabelMes() {
  const label = document.getElementById("mesAnoLabel");
  label.innerText = `Selecionar Data — ${nomesMeses[hoje.getMonth()]} ${hoje.getFullYear()}`;
}

function renderCalendario() {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

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
        renderCalendario();
      });
    }

    grid.appendChild(div);
  }
}

function renderHorarios() {
  const grid = document.getElementById("timesGrid");
  grid.innerHTML = "";

  horariosDisponiveis.forEach(horario => {
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

function verHorarios() {
  document.getElementById("timesGrid").scrollIntoView({ behavior: "smooth", block: "center" });
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
    id: `consulta-${Date.now()}`,
    psicologa: psicologa.nome,
    psicologaEmail: psicologa.email,
    psicologaIniciais: psicologa.iniciais,
    data: `${String(dataSelecionada).padStart(2, "0")}/${String(hoje.getMonth() + 1).padStart(2, "0")}/${hoje.getFullYear()}`,
    horario: horarioSelecionado,
    status: "AGENDADA"
  };

  localStorage.setItem("ultimaConsulta", JSON.stringify(consulta));

  const historico = JSON.parse(localStorage.getItem("historicoConsultas") || "[]");
  historico.push(consulta);
  localStorage.setItem("historicoConsultas", JSON.stringify(historico));

  //Agendamento das notificações (30/15/5 min antes)
  const [horas, minutos] = horarioSelecionado.split(":").map(Number);
  const dataHoraConsulta = new Date(hoje.getFullYear(), hoje.getMonth(), dataSelecionada, horas, minutos);

  const permissaoConcedida = await GerenciadorNotificacoes.pedirPermissao();
  if (permissaoConcedida) {
    GerenciadorNotificacoes.agendarParaConsulta(dataHoraConsulta, psicologa.nome);
  } else {
    console.warn("Usuário não concedeu permissão para notificações. Os lembretes não serão exibidos.");
  }

  window.location.href = "confirmacao.html";
}

document.addEventListener("DOMContentLoaded", () => {
  montarLabelMes();
  renderCalendario();
  renderHorarios();
});