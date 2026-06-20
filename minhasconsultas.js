// =========================================================
// MINHAS CONSULTAS — lista o histórico de consultas agendadas
// =========================================================

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

    <button class="btn_excluir" onclick="excluirConsulta('${consulta.id}')">
      <span class="material-symbols-outlined icoMini">delete</span>
      EXCLUIR CONSULTA
    </button>
  `;

  return card;
}

// Estado vazio (sem nenhuma consulta agendada) — usado quando a API
// não retorna nenhuma consulta ativa para este usuário.
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

/**
 * Exclui uma consulta pelo id (DELETE /api/consultas/<id>) e atualiza
 * a tela na hora, sem reload — busca a lista atualizada da API depois.
 */
async function excluirConsulta(id) {
  const confirmar = confirm("Deseja realmente excluir esta consulta?");
  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_BASE_URL}/api/consultas/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      const dadosErro = await resposta.json().catch(() => ({}));
      alert(dadosErro.erro || "Não foi possível excluir a consulta.");
      return;
    }

    await renderConsultas(); // busca a lista atualizada da API e redesenha, sem reload
  } catch (erro) {
    console.error("Erro ao excluir consulta:", erro);
    alert("Não foi possível conectar à API. Verifique se o backend está rodando.");
  }
}

/**
 * Busca a lista de consultas na API e redesenha a tela.
 * GET /api/consultas
 */
async function renderConsultas() {
  const lista = document.getElementById("listaConsultas");
  lista.innerHTML = `<p style="text-align:center; color:#999; font-size:12px; padding:20px;">Carregando consultas...</p>`;

  let consultasAtivas = [];

  try {
    const resposta = await fetch(`${API_BASE_URL}/api/consultas`);

    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}`);
    }

    const todasConsultas = await resposta.json();
    
    // A exclusão na API é um "soft delete" (status vira CANCELADA, mas a
    // linha continua existindo no banco) — escondemos essas da listagem.
    consultasAtivas = todasConsultas.filter(c => c.status !== "CANCELADA");
  } catch (erro) {
    console.error("Erro ao buscar consultas:", erro);
    lista.innerHTML = `
      <div class="aviso-exemplo" style="background-color:#FDEDEC; color:#922b21;">
        <span class="material-symbols-outlined icoMini" style="color:#c0392b;">error</span>
        Não foi possível conectar à API. Verifique se o backend está rodando em ${API_BASE_URL}.
      </div>
    `;
    return;
  }

  lista.innerHTML = "";

  if (consultasAtivas.length === 0) {
    lista.appendChild(criarEstadoVazio());
    return;
  }

  // A API já retorna ordenado do mais recente para o mais antigo (criada_em desc)
  consultasAtivas.forEach(consulta => {
    lista.appendChild(criarCardConsulta(consulta));
  });
}

document.addEventListener("DOMContentLoaded", renderConsultas);