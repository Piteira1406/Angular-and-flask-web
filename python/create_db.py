from python import app, db, User, products

# Usar o contexto da aplicação Flask
with app.app_context():
    # Remover todas as tabelas existentes (se houver)
    db.drop_all()
    # Criar todas as tabelas baseadas nos modelos
    db.create_all()
    print("Banco de dados criado com sucesso!")
    