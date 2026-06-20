  function openMenu() {
    document.getElementById("menu_aba").style.display = "block"; 
  }

  function closeMenu() {
    document.getElementById("menu_aba").style.display = "none";    
  }

  function temaLim() {
      document.documentElement.style.setProperty('--cor-click', '#38184C');
      document.documentElement.style.setProperty('--cor-sombra', '#9b0a59');
      document.documentElement.style.setProperty('--cor-text', 'black');
      document.documentElement.style.setProperty('--cor-back1', '#CEF09D');
      document.documentElement.style.setProperty('--cor-back2', '#4f6a93');
      document.documentElement.style.setProperty('--md-sys-color-primary', '#38184C');
  }

  function temaInatel() {
      document.documentElement.style.setProperty('--cor-click', '#126ae2');
      document.documentElement.style.setProperty('--cor-sombra', '#0a599b');
      document.documentElement.style.setProperty('--cor-text', 'black');
      document.documentElement.style.setProperty('--cor-back1', '#edf2f4');
      document.documentElement.style.setProperty('--cor-back2', '#6a937a');
      document.documentElement.style.setProperty('--md-sys-color-primary', '#126ae2');
  }

  function temaDark() {
      const cores = {
          '--cor-click': '#CEF09D',
          '--cor-sombra': '#9b0a59',
          '--cor-text': 'black', 
          '--cor-back1': '#38184C',
          '--cor-back2': '#4f6a93',
          '--md-sys-color-primary': '#CEF09D'
      };

      for (const [variavel, valor] of Object.entries(cores)) {
          document.documentElement.style.setProperty(variavel, valor);
      }
  }

  const eventos = [
      {
          id: 1,
          title: 'Semana do Software 2025',
          date: '12/05',
          time: '10:00',
          location: 'Salão de Eventos',
          type: 'tech',
          description: 'Uma semana inteira dedicada à tecnologia e inovação, com palestras, workshops e hackathons.',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400'
      },
      {
          id: 2,
          title: 'Workshop de IoT',
          date: '12/01',
          time: '08:00',
          location: 'Laboratório CS&I',
          type: 'tech',
          description: 'Workshop prático sobre Internet das Coisas e suas aplicações na indústria 4.0.',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=400'
      },
      {
          id: 3,
          title: 'Festa dos Alunos 2025',
          date: '18/05',
          time: '19:00',
          location: 'Área Esportiva',
          type: 'cultural',
          description: 'Venha comemorar a melhor Festa dos Alunos de todos os tempos!',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=400'
      },
      {
          id: 4,
          title: 'Feira de Oportunidades',
          date: '04/05',
          time: '10:00',
          location: 'Salão de Eventos',
          type: 'academic',
          description: 'Venha conhecer empresas e projetos com destaque na área da engenharia.',
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=400'
      }
  ];

  const carousel = document.querySelector('.carousel');

  function createCards() {
      eventos.forEach(event => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
              <img src="${event.image}" alt="${event.title}">
              <div class="info">
                  <h3>${event.title}</h3>
                  <p>${event.description}</p>
                  <p><span class="material-symbols-outlined icon">event</span> ${event.date} às ${event.time} <span class="material-symbols-outlined icon">pin_drop</span> ${event.location}</p>
              </div>
          `;
          carousel.appendChild(card);
      });
  }

  let index = 0;
  function nextCard() {
      index = (index + 1) % eventos.length;
      updateCarousel();
  }

  function prevCard() {
      index = (index - 1 + eventos.length) % eventos.length;
      updateCarousel();
  }

  function updateCarousel() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  document.getElementById('nextBtn').addEventListener('click', nextCard);
  document.getElementById('prevBtn').addEventListener('click', prevCard);

  setInterval(nextCard, 5000);

  let startX;
  carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
  });
  carousel.addEventListener('touchend', (e) => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextCard();
      if (endX - startX > 50) prevCard();
  });

  createCards();

  // Componente Aulas
  class AulasComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); 
      this.aulas = [
        { id: 1, disciplina: 'S05 - Interface Homem-máquina', data: 'ter', horario: '10:00', local: 'P1-S17', prova_alert: false, prova: '12/05', frequencia: '10/25', nota: '10' },
        { id: 2, disciplina: 'E01 - Circuitos Elétricos em Corrente Contínua', data: 'ter', horario: '10:00', local: 'P1-S17', prova_alert: true, prova: '12/05', frequencia: '10/25', nota: '5' },
        { id: 3, disciplina: 'M02 - Álgebra e Geometria Analítica', data: 'ter', horario: '10:00', local: 'P1-S17', prova_alert: true, prova: '12/05', frequencia: '10/25', nota: '7' }
      ];
      this.hoje = "ter"; 
    }

    connectedCallback() {
      this.render(); 
    }

    render() {
      const aulasDia = this.aulas.filter(a => a.data === this.hoje); 
      this.shadowRoot.innerHTML = `
        <style>
        .comp-aula {
          position: relative;
          background-color: white;
          padding: 15px;
          margin: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .titulo_aula {
          font-family: "Arimo", sans-serif;
          font-weight: bold;
          font-size: 15px;
          color: var(--cor-text);
          padding: 0 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p {
          font-family: "Arimo", sans-serif;
          font-size: 11px;
          color: var(--cor-text);
          line-height: 1.5;
          padding: 0 5px;
        }
        .lables { display: flex; }
        .lable-prova { background-color: var(--prova); padding: 7px 15px; margin-bottom: 10px; border-radius: 500px; text-align: center; }
        .lable-frequencia { background-color: var(--frequencia); padding: 7px 15px; margin-right: 10px; border-radius: 500px; }
        .lable-nota { background-color: var(--prova); padding: 7px 15px; margin-right: 10px; border-radius: 500px; }
        .lable-nota-vermelho { background-color: red; padding: 7px 15px; margin-right: 10px; border-radius: 500px; }
        .lable-nota-laranja { background-color: yellow; padding: 7px 15px; margin-right: 10px; border-radius: 500px; color: black; }
        .lable-nota-verde { background-color: green; padding: 7px 15px; margin-right: 10px; border-radius: 500px; }
        .p_lable { font-family: "Arimo", sans-serif; font-size: 11px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        </style>
        <div>
          ${aulasDia.map(a => {
            let provaDisplay = a.prova_alert ? '' : 'display: none;';
            let notaDisplay = 'lable-nota';
            if (a.nota < 6) {
              notaDisplay = 'lable-nota-vermelho';
            } else if (a.nota >= 6 && a.nota < 8) {
              notaDisplay = 'lable-nota-laranja';
            } else {
              notaDisplay = 'lable-nota-verde';
            }
            return `
              <div class="comp-aula">
                <div class="lable-prova p_lable" style="${provaDisplay}">PROVA: <b>${a.prova}</b></div>
                <div class="titulo_aula">${a.disciplina}</div>
                <p class="p">Local e Horário: <b>${a.local} - ${a.horario}</b></p>
                <div class="lables">
                  <div class="lable-frequencia p_lable">FALTAS: <b>${a.frequencia}</b></div>
                  <div class="${notaDisplay} p_lable">CR: <b>${a.nota}</b></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }
  customElements.define('aulas-component', AulasComponent);

  //Reserva de armários
  const usuario = { nome: "Raphael", matricula: "123456", pendencia: false, acessibilidade: true };

  const armarios = [
    { id: 1, formato: "padrao", status: true, acessivel: false },
    { id: 2, formato: "padrao", status: true, acessivel: false },
    { id: 3, formato: "padrao", status: true, acessivel: false },
    { id: 4, formato: "padrao", status: false, acessivel: true },
    { id: 5, formato: "padrao", status: false, acessivel: true },
    { id: 6, formato: "duplo", status: true, acessivel: true },
    { id: 7, formato: "duplo", status: false, acessivel: true },
    { id: 8, formato: "duplo", status: false, acessivel: true },  
  ];

  let tipoSelecionado = null;

  document.querySelectorAll('.tipo').forEach(div => {
    div.addEventListener('click', () => {
      document.querySelectorAll('.tipo').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
      tipoSelecionado = div.dataset.value;
    });
  });

  function reservarArmario() {
    const resultado = document.getElementById("resultado");
    const armarioNumero = document.getElementById("armarioNumero");

    if (!tipoSelecionado) {
      resultado.innerText = "Por favor, selecione um tipo de armário antes de reservar.";
      armarioNumero.style.display = "none";
      return;
    }

    let armariosDisponiveis = armarios.filter(a => 
      a.formato === tipoSelecionado && a.status === true && usuario.acessibilidade === a.acessivel
    );

    if (armariosDisponiveis.length === 0) {
      resultado.innerText = `Olá, ${usuario.nome}! Nenhum armário disponível para o tipo selecionado.`;
      armarioNumero.style.display = "none";
      return;
    }

    let armarioSorteado = armariosDisponiveis[Math.floor(Math.random() * armariosDisponiveis.length)];
    let armarioEmprestado = armarios.find(armario => armario.id === armarioSorteado.id);
    armarioEmprestado.status = false;

    let dataReserva = new Date();
    armarioEmprestado.dataReserva = dataReserva.toLocaleString("pt-BR");

    let dataEntrega = new Date(dataReserva.getTime() + 24 * 60 * 60 * 1000);
    armarioEmprestado.dataEntrega = dataEntrega.toLocaleString("pt-BR");

    usuario.pendencia = true;

    armarioNumero.innerText = `Armário Nº ${armarioEmprestado.id}`;
    armarioNumero.style.display = "block";

    resultado.innerText = 
      `Data da reserva: ${armarioEmprestado.dataReserva}\n` +
      `Data de entrega: ${armarioEmprestado.dataEntrega}`;
  } 

//consulta de agendamento de psicólogo
function agendarConsulta() {
  window.location.href = "agendamento.html";
}

function verConsultas() {
  window.location.href = "minhasconsultas.html";
}