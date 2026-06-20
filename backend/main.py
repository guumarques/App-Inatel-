from flask import Flask
from flask_cors import CORS
from database import db
from flask_migrate import Migrate
from rotas import agenda

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///consultas.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
 
db.init_app(app)
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "https://guumarques.github.io"
])
migrate = Migrate(app, db)

with app.app_context(): #Cria as tabelas no banco de dados toda vez que não existi
    db.create_all()

app.register_blueprint(agenda)

if __name__ == "__main__":
    app.run(debug=True)