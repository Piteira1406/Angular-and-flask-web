from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Conexão com o banco de dados
def get_db_connection():
    conn = sqlite3.connect('products.db')
    conn.row_factory = sqlite3.Row
    return conn

# Rota para busca de produtos
@app.route('/api/products/search', methods=['GET'])
def search_products():
    search_term = request.args.get('q', '').lower()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Busca por nome, descrição ou categoria (ajuste conforme sua estrutura)
    query = """
    SELECT * FROM produtos 
    WHERE LOWER(name) LIKE ? OR 
          LOWER(brand) LIKE ?
    LIMIT 10
    """
    search_pattern = f'%{search_term}%'
    products = cursor.execute(query, (search_pattern, search_pattern, search_pattern)).fetchall()
    
    conn.close()
    
    # Converter para lista de dicionários
    products_list = [dict(product) for product in products]
    return jsonify(products_list)

if __name__ == '__main__':
    app.run(debug=True)