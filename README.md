# App Inatel — Apoio Psicológico

Funcionalidade de agendamento de consultas psicológicas integrada ao aplicativo acadêmico do Inatel, permitindo que o aluno agende, visualize e cancele consultas diretamente pelo app, com persistência real em banco de dados e lembretes automáticos via notificação do navegador.

## Descrição do Projeto

O Apoio Psicológico é uma funcionalidade desenvolvida para o aplicativo acadêmico do Inatel, permitindo que o aluno agende consultas psicológicas pela instituição sem precisar de contato manual, e-mail ou formulário externo. O fluxo cobre desde a tela inicial (onde o aluno vê um resumo de suas consultas) até o agendamento completo (escolha de data e horário) e o gerenciamento das consultas já marcadas (visualização e cancelamento).

O projeto nasceu como uma extensão do app acadêmico já existente do Inatel (que reúne funcionalidades como reserva de armários, acompanhamento de notas e frequência, e agenda de eventos), adicionando uma nova categoria de suporte ao aluno.

## Objetivo

O levantamento de necessidades dos alunos do Inatel, conduzido por meio de card sorting, classificou as demandas estudantis em seis categorias, ordenadas por relevância:

1. Mercado de Trabalho
2. Suporte Estudantil
3. Suporte Financeiro
4. **Apoio Socioemocional**
5. Conteúdos e Notícias
6. Intercâmbio

O **Apoio Socioemocional** figura como a 4ª necessidade mais relevante identificada pelos próprios alunos, evidenciando uma demanda já reconhecida, porém não atendida por nenhuma funcionalidade do aplicativo acadêmico original. Esse achado é reforçado por um focus group realizado com os alunos, cujos relatos se concentram quase exclusivamente em funcionalidades acadêmicas operacionais (horários, notas, frequência, provas) — nenhum aluno mencionou qualquer recurso de suporte emocional, apesar do tema ter sido apontado como relevante na etapa de card sorting. Diversos relatos do mesmo focus group também descrevem frustração e desgaste com o aplicativo atual, reforçando o quanto a rotina acadêmica já é, por si, uma fonte de estresse para o aluno.

O objetivo deste projeto é, portanto, **oferecer um canal simples e direto de acesso ao suporte psicológico da instituição, dentro do mesmo app que o aluno já usa diariamente para questões acadêmicas.**

## Tecnologias Utilizadas

### Front-end
- **HTML5 / CSS3** — estrutura e estilo das telas, com variáveis CSS para suporte a múltiplos temas (Inatel, Limão, Dark)
- **JavaScript (Vanilla)** — toda a lógica de interface, sem frameworks
- **Web Components** — utilizado em outras partes do app (ex: `aulas-component`)
- **Web Notifications API** — disparo de lembretes nativos do navegador
- **Material Symbols** e **Google Fonts (Arimo)** — ícones e tipografia
- **GitHub Pages** — hospedagem do front-end

### Back-end
- **Python 3**
- **Flask** — framework da API REST
- **Flask-SQLAlchemy** — ORM para persistência de dados
- **Flask-CORS** — liberação de requisições cross-origin entre front-end e back-end
- **SQLite** — banco de dados relacional, em arquivo
- **Gunicorn** — servidor WSGI de produção
- **Render** — hospedagem do back-end

## Principais Funcionalidades

### 1. Tela Inicial (Dashboard)
Exibe um card de "Apoio Psicológico" com dois indicadores atualizados em tempo real, consultando diretamente o banco de dados:
- **CONSULTAS:** quantidade de consultas agendadas e ainda não realizadas
- **PRÓXIMA:** data e horário da consulta mais próxima a partir do momento atual

### 2. Agendamento de Consulta
- Calendário interativo com os dias do mês, bloqueando automaticamente dias já passados e finais de semana
- Lista de horários disponíveis (09:00–16:00, em intervalos de 30 minutos, exceto o horário de almoço 12:00–13:30), carregada dinamicamente a partir da API — horários já ocupados não são exibidos
- Validação que impede confirmar a consulta sem selecionar data e horário
- Bloqueio de conflito: a API rejeita duas consultas para a mesma data e horário

### 3. Confirmação e Lembretes Automáticos
- Tela de resumo da consulta confirmada (psicóloga, data, horário, status)
- Agendamento automático de três notificações nativas do navegador — **30, 15 e 5 minutos antes** do horário da consulta — para reduzir esquecimentos

### 4. Minhas Consultas
- Listagem de todas as consultas agendadas, com dados da psicóloga (nome, e-mail, iniciais)
- Botão de exclusão (cancelamento) em cada consulta, com atualização instantânea da lista — sem necessidade de recarregar a página
- Estado vazio tratado (mensagem amigável quando não há consultas agendadas)

### 5. API REST
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/consultas` | Lista todas as consultas |
| `POST` | `/api/consultas` | Cria uma nova consulta |
| `GET` | `/api/consultas/<id>` | Detalha uma consulta específica |
| `DELETE` | `/api/consultas/<id>` | Cancela uma consulta (soft delete) |
| `GET` | `/api/horarios-disponiveis?data=DD/MM/AAAA` | Lista horários livres para uma data |
| `GET` | `/api/health` | Verifica se a API está no ar |

## Arquitetura

```
Front-end (GitHub Pages)  →  API REST Flask (Render)  →  Banco de dados SQLite
```

O front-end se comunica com o back-end via `fetch()`, consumindo e enviando dados em formato JSON. A URL da API é centralizada em um único arquivo de configuração (`config.js`), facilitando a troca entre ambiente local e ambiente de produção.

### Diagrama de Classes

O modelo de dados foi desenhado considerando quatro entidades principais:

- **Aluno** — agenda, cancela e visualiza suas próprias consultas
- **Consulta** — entidade central, relacionando aluno e psicólogo, com data, horário e status
- **Psicólogo** — visualiza sua agenda de consultas
- **Notificação** — representa cada lembrete agendado (mensagem, horário de envio, status de envio)

## Estrutura de Arquivos

```
├── index.html                 # Tela inicial (dashboard)
├── app.js                     # Lógica da tela inicial
├── style.css                  # Estilos globais e temas
├── config.js                  # URL base da API (único ponto de configuração)
├── agendamento.html / .css / .js   # Tela de agendamento de consulta
├── confirmacao.html / .css / .js   # Tela de confirmação da consulta
├── minhasconsultas.html / .css / .js  # Tela de listagem e cancelamento
├── notificacao.js             # Classe Notificacao e gerenciador de lembretes
└── backend/
    ├── app.py                 # Rotas da API REST
    ├── modelos.py              # Modelo de dados (Consulta)
    ├── extensoes.py            # Instância do SQLAlchemy
    └── requirements.txt        # Dependências Python
```

## Instruções de Execução

### Pré-requisitos
- Python 3.10 ou superior
- Um servidor local para o front-end (ex: extensão Live Server do VS Code, ou `python -m http.server`)

### Executando o back-end localmente

```bash
cd backend
pip install -r requirements.txt
python3 app.py
```

A API ficará disponível em `http://127.0.0.1:5000`.

### Executando o front-end localmente

1. Abra a pasta raiz do projeto com o Live Server (VS Code) ou rode:
   ```bash
   python3 -m http.server 5500
   ```
2. Acesse `http://127.0.0.1:5500/index.html` no navegador.
3. Confirme que o `config.js` está apontando para `http://127.0.0.1:5000` (ambiente local).

### Publicando em produção

- **Front-end:** hospedado via GitHub Pages, publicando a partir da branch `main`, raiz do repositório.
- **Back-end:** hospedado via Render, com *Root Directory* configurado como `backend`, comando de build `pip install -r requirements.txt` e comando de start `gunicorn app:app`.
- Após o deploy do back-end, atualize a constante `API_BASE_URL` em `config.js` com a URL pública gerada pelo Render.

> **Observação:** no plano gratuito do Render, o serviço entra em repouso após períodos de inatividade. A primeira requisição após esse período pode demorar de 30 a 60 segundos para responder.

## Exemplo de Uso

1. O aluno acessa a tela inicial e vê que possui 2 consultas agendadas, a próxima hoje às 14h.
2. Clica em **Agendar Consulta**, seleciona uma data disponível no calendário.
3. A lista de horários disponíveis daquele dia é carregada automaticamente.
4. Seleciona um horário e confirma — recebe a tela de resumo e autoriza notificações.
5. Trinta minutos antes da consulta, recebe uma notificação do navegador avisando.
6. Caso precise cancelar, acessa **Minhas Consultas** e remove o agendamento, que desaparece da lista instantaneamente.

## Aprendizados Adquiridos

- **Integração front-end e back-end:** entendimento prático de como uma interface estática se conecta a uma API REST via `fetch()`, incluindo tratamento de erros de rede, conflitos (HTTP 409) e estados de carregamento.
- **Persistência de dados:** progressão de uma solução puramente client-side (`localStorage`) para um banco de dados real, compreendendo as limitações de cada abordagem (dados isolados por navegador vs. dados compartilhados e duráveis).
- **Modelagem de dados:** tradução de um diagrama de classes UML para um modelo real de banco de dados (SQLAlchemy), incluindo decisões como o uso de *soft delete* para preservar histórico mesmo após o cancelamento.
- **Depuração de CSS herdado:** identificação de conflitos de especificidade CSS (regras genéricas de `button` sobrepondo estilos específicos), reforçando a importância de isolar componentes.
- **Web Notifications API:** uso de permissões do navegador de forma assíncrona sem bloquear o fluxo principal da aplicação, e a necessidade de mecanismos de *fallback* (tempo limite, reagendamento automático) quando a interação do usuário é incerta.
- **Deploy e DevOps básico:** publicação de um front-end estático via GitHub Pages e de uma API Flask via Render, incluindo a resolução de problemas reais de produção (erro de módulo no `gunicorn`, configuração de CORS por origem, variáveis de ambiente de porta).
- **Trabalho orientado a pesquisa:** justificativa de uma funcionalidade com base em dados reais de levantamento de necessidades (card sorting e focus group), em vez de suposições.

## Imagens e Diagramas

- `Wireframe.pdf` — wireframe das três telas principais (Início, Agendamento, Confirmação)
- `diagrama_de_classes.pdf` — diagrama de classes UML do modelo de dados

---

Projeto desenvolvido como parte das disciplinas de Interação Homem-Máquina do Inatel.
