# backend/routes/auth.py
from flask_mail import Message
from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token
import bcrypt
from datetime import datetime, timedelta
import random
from extensions import mail
from config import Config
def generate_otp():
    return str(random.randint(100000, 999999))

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    new_user = User(name=name, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()


    # 🔍 DEBUG START
    print("RAW DATA:", data)
    print("Entered password:", password)

    if user:
        print("Stored hash:", user.password)

        result = bcrypt.checkpw(
            password.encode('utf-8'),
            user.password.encode('utf-8')
        )

        print("Password match:", result)
    else:
        print("User not found")
    # 🔍 DEBUG END


    if user and bcrypt.checkpw(
        password.encode('utf-8'),
        user.password.encode('utf-8')  
    ):
        access_token = create_access_token(identity=str(user.id))

        return jsonify({
            "token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    otp = generate_otp()

    user.otp = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)

    db.session.commit()

    # Send Email
    msg = Message(
        subject="Password Reset OTP",
        sender=Config.MAIL_USERNAME,
        recipients=[email],
        body=f"Your OTP is {otp}. It will expire in 5 minutes."
    )

    mail.send(msg)

    return jsonify({"message": "OTP sent to email"}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.otp != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    if datetime.utcnow() > user.otp_expiry:
        return jsonify({"error": "OTP expired"}), 400

    hashed_password = bcrypt.hashpw(
        new_password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    user.password = hashed_password
    user.otp = None
    user.otp_expiry = None

    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200