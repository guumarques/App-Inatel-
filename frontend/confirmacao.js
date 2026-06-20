function carregarResumo() {
  const dadosSalvos = localStorage.getItem("ultimaConsulta");

  if (!dadosSalvos) {
    // Sem dados salvos
    document.getElementById("resumoPsicologa").innerText = "Nenhuma consulta encontrada";
    document.getElementById("resumoData").innerText = "—";
    document.getElementById("resumoHorario").innerText = "—";
    document.getElementById("resumoStatus").innerText = "—";
    return;
  }

  const consulta = JSON.parse(dadosSalvos);

  document.getElementById("resumoPsicologa").innerText = consulta.psicologa || "—";
  document.getElementById("resumoData").innerText = consulta.data || "—";
  document.getElementById("resumoHorario").innerText = consulta.horario || "—";
  document.getElementById("resumoStatus").innerText = consulta.status || "—";
}

function voltarAoInicio() {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", carregarResumo);