const CONSULTAS_EXEMPLO = [
  {
    id: "exemplo-1",
    psicologa: "Ludimila Rocha da Silveira",
    psicologaEmail: "ludimila@inatel.br",
    psicologaIniciais: "LS",
    data: "20/06/2026",
    horario: "14:00",
    status: "AGENDADA"
  },
  {
    id: "exemplo-2",
    psicologa: "Ludimila Rocha da Silveira",
    psicologaEmail: "ludimila@inatel.br",
    psicologaIniciais: "LS",
    data: "10/06/2026",
    horario: "10:00",
    status: "REALIZADA"
  }
];

function classeStatus(status) {
  switch (status) {
    case "AGENDADA": return "status-agendada";
    case "REALIZADA": return "status-realizada";
    case "CANCELADA": return "status-cancelada";
    default: return "status-agendada";
  }
}

function criarCardConsulta(consulta) {
  const card = document.createElement("div");
  card.classList.add("container");

  const iniciais = consulta.psicologaIniciais || "PS";
  const email = consulta.psicologaEmail || "—";

  card.innerHTML = `
    <div class="consulta-header">
      <div class="consulta-data-horario">${consulta.data} às ${consulta.horario}</div>
      <div class="consulta-status ${classeStatus(consulta.status)}">${consulta.status}</div>
    </div>

    <div class="section-label">Psicóloga</div>
    <div class="psico-row">
      <div class="psico-avatar">${iniciais}</div>
      <div>
        <div class="psico-name">${consulta.psicologa}</div>
        <div class="psico-email">${email}</div>
      </div>
    </div>

    <hr class="consulta-divisor">

    <div class="consulta-contato">
      <span class="material-symbols-outlined icoMini">mail</span>
      Em caso de dúvidas, contate ${consulta.psicologa.split(" ")[0]} pelo e-mail acima.
    </div>
  `;

  return card;
}

function criarEstadoVazio() {
  const wrap = document.createElement("div");
  wrap.classList.add("sem-consultas");
  wrap.innerHTML = `
    <span class="material-symbols-outlined icoVazio">event_busy</span>
    <p>Você ainda não tem nenhuma consulta agendada.</p>
    <button class="btn_agendar" onclick="window.location.href='agendamento.html'">AGENDAR CONSULTA</button>
  `;
  return wrap;
}

function criarAvisoExemplo() {
  const aviso = document.createElement("div");
  aviso.classList.add("aviso-exemplo");
  aviso.innerHTML = `
    <span class="material-symbols-outlined icoMini">info</span>
    Estes são dados de exemplo. Agende uma consulta para ver suas informações reais aqui.
  `;
  return aviso;
}

function renderConsultas() {
  const lista = document.getElementById("listaConsultas");
  lista.innerHTML = "";

  const dadosReais = localStorage.getItem("historicoConsultas");
  const historicoSalvo = dadosReais ? JSON.parse(dadosReais) : [];
  const exibindoExemplo = historicoSalvo.length === 0;

  const historico = exibindoExemplo ? CONSULTAS_EXEMPLO : historicoSalvo;

  if (exibindoExemplo) {
    lista.appendChild(criarAvisoExemplo());
  }

  // Mais recente primeiro 
  const ordenado = [...historico].reverse();

  ordenado.forEach(consulta => {
    lista.appendChild(criarCardConsulta(consulta));
  });
}

document.addEventListener("DOMContentLoaded", renderConsultas);