from datetime import datetime
from database import db


class Consulta(db.Model):
    """
    Representa uma consulta psicológica agendada.
    Espelha a estrutura que já usávamos no localStorage (historicoConsultas),
    para a migração do frontend ser direta.
    """
    __tablename__ = "consultas"

    id = db.Column(db.Integer, primary_key=True)
    psicologa_nome = db.Column(db.String(120), nullable=False)
    psicologa_email = db.Column(db.String(120), nullable=False)
    data = db.Column(db.String(10), nullable=False)       # formato "DD/MM/AAAA", igual ao frontend já envia
    horario = db.Column(db.String(5), nullable=False)      # formato "HH:MM"
    status = db.Column(db.String(20), nullable=False, default="AGENDADA")
    criada_em = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "psicologa": self.psicologa_nome,
            "psicologaEmail": self.psicologa_email,
            "data": self.data,
            "horario": self.horario,
            "status": self.status
        }