from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from python import app, db, User, products

with app.app_context():
    db.create_all()
    print("DB CREATED!")

@app.route('/teste')
def teste():
    users = User.query.all() 
    return jsonify([u.user for u in users])

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('user')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter(User.email == email).first():
        return jsonify({'message': 'Email already exists'}), 409
    
    if User.query.filter(User.user == username).first():
        return jsonify({'message': 'Username already exists'}), 409
    
    try: 
        hashed_password = generate_password_hash(password)
        new_user = User(user=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'User already exists'}), 409


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('user')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    user = User.query.filter_by(user=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    return jsonify({'message': 'Login successful'}), 200

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        
        product_list = products.query.all()
        
        
        products_data = []
        for product in product_list:
            products_data.append({
                'id': product.id,
                'name': product.name,
                'image': product.image,
                'price': product.price,
                'brand': product.brand
            })
        
        
        return jsonify({
            'message': 'Products retrieved successfully',
            'products': products_data,
            'count': len(products_data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'message': 'Error retrieving products',
            'error': str(e)
        }), 500
if __name__ == '__main__':
    app.run(debug=True)