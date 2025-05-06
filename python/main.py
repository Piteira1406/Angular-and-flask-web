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
        
        
@app.route('/api/addproducts', methods=['POST'])
def add_product():
    """Adding products to the database - single or batch"""
    data = request.get_json()
    
    
    if 'products' in data and isinstance(data['products'], list):
        products_to_add = data['products']
        added = 0
        skipped = 0

        for product_data in products_to_add:
            if not all(field in product_data for field in ['name', 'image', 'price', 'brand']):
                continue
            if products.query.filter_by(name=product_data['name']).first():
                skipped += 1
                continue
            new_product = products(
                name=product_data['name'],
                image=product_data['image'],
                price=product_data['price'],
                brand=product_data['brand']
            )

            db.session.add(new_product)
            added += 1
        try:
            db.session.commit()
            return jsonify({
                'message': f'{added} products added, {skipped} skipped',
                'added': added,
                'skipped': skipped
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Error adding products', 'error': str(e)}), 500
    

    else:
        required_fields = ['name', 'image', 'price', 'brand']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Missing required field: {field}'}), 400
            
        if products.query.filter_by(name=data['name']).first():
            return jsonify({'message': 'Product already exists'}), 409
        try:
            new_product = products(
                name=data['name'],
                image=data['image'],
                price=data['price'],
                brand=data['brand']
            )
            db.session.add(new_product)
            db.session.commit()
            return jsonify({'message': 'Product added successfully', 'id': new_product.id}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Error adding product', 'error': str(e)}), 500
        
@app.route('/items/search/name', methods=['GET'])
def search_items(name):
    items = Item.query.filter(Item.name.ilike(f'%{name}%')).all()
    return jsonify([item.to_dict() for item in items])


if __name__ == '__main__':
    app.run(debug=True)