from flask import Blueprint, jsonify, request
from modelos import Consulta
from database import db

agenda = Blueprint('agenda', __name__)

# Horários possíveis: 09:00 às 16:00, de 30 em 30 min, sem o almoço (12:00-13:30)
# (mesma regra que já existia no agendamento.js do frontend)
def gerar_horarios_base():
    horarios = []
    inicio = 9 * 60
    fim = 16 * 60
    almoco_inicio = 12 * 60
    almoco_fim = 13 * 60 + 30

    minutos = inicio
    while minutos <= fim:
        if not (almoco_inicio <= minutos < almoco_fim):
            h = str(minutos // 60).zfill(2)
            m = str(minutos % 60).zfill(2)
            horarios.append(f"{h}:{m}")
        minutos += 30

    return horarios


@agenda.route("/api/consultas", methods=["GET"])
def listar_consultas():
    consultas = Consulta.query.order_by(Consulta.criada_em.desc()).all()
    return jsonify([c.to_dict() for c in consultas]), 200


@agenda.route("/api/consultas", methods=["POST"])
def criar_consulta():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({"erro": "Corpo da requisição vazio ou inválido."}), 400

    campos_obrigatorios = ["psicologa", "psicologaEmail", "data", "horario"]
    faltando = [campo for campo in campos_obrigatorios if not dados.get(campo)]
    if faltando:
        return jsonify({"erro": f"Campos obrigatórios faltando: {', '.join(faltando)}"}), 400

    # Evita duas consultas no mesmo horário/data (regra simples de conflito)
    conflito = Consulta.query.filter_by(data=dados["data"], horario=dados["horario"]).filter(
        Consulta.status != "CANCELADA"
    ).first()
    if conflito:
        return jsonify({"erro": "Já existe uma consulta agendada nesse dia e horário."}), 409

    nova_consulta = Consulta(
        psicologa_nome=dados["psicologa"],
        psicologa_email=dados["psicologaEmail"],
        data=dados["data"],
        horario=dados["horario"],
        status=dados.get("status", "AGENDADA")
    )

    db.session.add(nova_consulta)
    db.session.commit()

    return jsonify(nova_consulta.to_dict()), 201


@agenda.route("/api/consultas/<int:consulta_id>", methods=["DELETE"])
def cancelar_consulta(consulta_id):
    consulta = Consulta.query.get(consulta_id)
    if not consulta:
        return jsonify({"erro": "Consulta não encontrada."}), 404

    consulta.status = "CANCELADA"
    db.session.commit()

    return jsonify(consulta.to_dict()), 200


@agenda.route("/api/horarios-disponiveis", methods=["GET"])
def horarios_disponiveis():
    data = request.args.get("data")
    if not data:
        return jsonify({"erro": "Parâmetro 'data' é obrigatório (formato DD/MM/AAAA)."}), 400

    todos_horarios = gerar_horarios_base()

    ocupados = {
        c.horario for c in Consulta.query.filter_by(data=data).filter(Consulta.status != "CANCELADA").all()
    }

    disponiveis = [h for h in todos_horarios if h not in ocupados]

    return jsonify({"data": data, "horariosDisponiveis": disponiveis}), 200

