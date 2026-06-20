class Notificacao {
  #mensagem;
  #horarioEnvio; 
  #enviada;
  #id;
  #timeoutId;

  constructor(mensagem, horarioEnvio, id, enviada = false) {
    this.#mensagem = mensagem;
    this.#horarioEnvio = new Date(horarioEnvio);
    this.#enviada = enviada;
    this.#id = id;
    this.#timeoutId = null;
  }

  get mensagem() { return this.#mensagem; }
  get horarioEnvio() { return this.#horarioEnvio; }
  get enviada() { return this.#enviada; }
  get id() { return this.#id; }

  //Dispara a notificação 
  enviar() {
    if (this.#enviada) return; //evita reenvio duplicado

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Apoio Psicológico — Inatel", {
        body: this.#mensagem,
        icon: "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/notifications/default/24px.svg",
        tag: this.#id
      });
    } else {
    
      console.warn(`[Notificacao] Permissão não concedida. Mensagem: ${this.#mensagem}`);
    }

    this.#enviada = true;
    GerenciadorNotificacoes.salvarEstado(this);
  }

  //Calcula o tempo restante até horarioEnvio e agenda o disparo via setTimeout.
   
  agendarEnvio() {
    if (this.#enviada) return;

    const agora = new Date();
    const delay = this.#horarioEnvio.getTime() - agora.getTime();

    if (delay <= 0) {
      console.warn(
        `[Notificacao] Descartada: horário de envio já passou. ` +
        `Mensagem: "${this.#mensagem}" | horarioEnvio: ${this.#horarioEnvio.toLocaleString("pt-BR")} | agora: ${agora.toLocaleString("pt-BR")}`
      );
      return;
    }

    this.#timeoutId = setTimeout(() => this.enviar(), delay);
    console.log(
      `[Notificacao] Agendada para ${this.#horarioEnvio.toLocaleString("pt-BR")} ` +
      `(dispara em ${Math.round(delay / 1000)}s). Mensagem: "${this.#mensagem}"`
    );
  }

  cancelar() {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = null;
    }
  }

  toJSON() {
    return {
      id: this.#id,
      mensagem: this.#mensagem,
      horarioEnvio: this.#horarioEnvio.toISOString(),
      enviada: this.#enviada
    };
  }
}

const GerenciadorNotificacoes = {
  CHAVE_STORAGE: "notificacoesAgendadas",

  //Pede permissão ao navegador para mostrar notificações nativas.
  async pedirPermissao() {
    if (!("Notification" in window)) {
      console.warn("Este navegador não suporta Web Notifications API.");
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;

    const resposta = await Notification.requestPermission();
    return resposta === "granted";
  },

  //Cria e agenda as 3 notificações (30, 15 e 5 minutos antes) para uma consulta. 
  agendarParaConsulta(dataHoraConsulta, psicologaNome) {
    const minutosAntes = [30, 15, 5];

    const notificacoes = minutosAntes.map(minutos => {
      const horarioEnvio = new Date(dataHoraConsulta.getTime() - minutos * 60 * 1000);
      const mensagem = `Sua consulta com ${psicologaNome} começa em ${minutos} minutos.`;
      const id = `consulta-${dataHoraConsulta.getTime()}-${minutos}min`;

      return new Notificacao(mensagem, horarioEnvio, id);
    });

    // Salva todas no localStorage (substituindo agendamentos antigos)
    const todasSalvas = notificacoes.map(n => n.toJSON());
    localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(todasSalvas));

    // Agenda o disparo de cada uma
    notificacoes.forEach(n => n.agendarEnvio());

    return notificacoes;
  },

  //Atualiza o estado de uma notificação específica no localStorage. */
  salvarEstado(notificacao) {
    const lista = this.carregarTodas();
    const index = lista.findIndex(n => n.id === notificacao.id);
    if (index !== -1) {
      lista[index] = notificacao.toJSON();
      localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(lista));
    }
  },

  //Lê a lista de notificações salvas (formato simples, não instâncias). */
  carregarTodas() {
    const dados = localStorage.getItem(this.CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : [];
  },

  reagendarPendentes() {
    const lista = this.carregarTodas();

    lista.forEach(dados => {
      if (dados.enviada) return; // já foi enviada, não reagenda

      const notificacao = new Notificacao(
        dados.mensagem,
        dados.horarioEnvio,
        dados.id,
        dados.enviada
      );
      notificacao.agendarEnvio();
    });
  }
};

// Em toda página que carregar este script, tenta reagendar pendências
document.addEventListener("DOMContentLoaded", () => {
  GerenciadorNotificacoes.reagendarPendentes();
});