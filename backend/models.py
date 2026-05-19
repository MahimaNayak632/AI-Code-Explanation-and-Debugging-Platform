# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# class User(db.Model):
#     __tablename__ = 'users'
    
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password = db.Column(db.String(255), nullable=False)
#     profile_pic = db.Column(db.String(255), nullable=True)   # New field for profile image
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     otp = db.Column(db.String(6), nullable=True)
#     otp_expiry = db.Column(db.DateTime, nullable=True)



class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    profile_pic = db.Column(db.String(255), nullable=True)

    gender = db.Column(db.String(20), nullable=True)
    
    bio = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    otp = db.Column(db.String(6), nullable=True)

    otp_expiry = db.Column(db.DateTime, nullable=True)


    def __repr__(self):
        return f'<User {self.email}>'


class CodeSubmission(db.Model):
    __tablename__ = 'code_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=True)
    description = db.Column(db.Text, nullable=True)
    code = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(20), nullable=False)
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('codes', lazy=True))

    def __repr__(self):
        return f'<CodeSubmission {self.id} - {self.language}>'