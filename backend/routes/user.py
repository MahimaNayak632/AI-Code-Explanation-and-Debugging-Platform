# backend/routes/user.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, CodeSubmission
import bcrypt
import os
from werkzeug.utils import secure_filename

user_bp = Blueprint('user', __name__)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ================= GET PROFILE =================
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
    "id": user.id,
    "name": user.name,
    "email": user.email,
    "gender": user.gender,
    "bio": user.bio,
    "profile_pic": user.profile_pic
})

# ================= UPDATE PROFILE (Name, Email - No Password) =================
@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    data = request.get_json()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'name' in data and data['name']:
        user.name = data['name']
    if 'email' in data and data['email']:
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user.id:
            return jsonify({"error": "Email already taken"}), 409
        user.email = data['email']

        if 'gender' in data:
            user.gender = data['gender']

        if 'bio' in data:
             user.bio = data['bio']


    db.session.commit()
    return jsonify({"message": "Profile updated successfully", "user": {"name": user.name, "email": user.email}})


# ================= CHANGE PASSWORD (Used in Settings.js) =================
@user_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():

    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    data = request.get_json()

    current = data.get('currentPassword')
    new_pass = data.get('newPassword')

    if not current or not new_pass:
        return jsonify({
            "error": "Current and new password required"
        }), 400

    # ✅ CHECK OLD PASSWORD
    if not bcrypt.checkpw(
        current.encode('utf-8'),
        user.password.encode('utf-8')
    ):
        return jsonify({
            "error": "Current password is incorrect"
        }), 400

    # ✅ HASH NEW PASSWORD
    hashed_password = bcrypt.hashpw(
        new_pass.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    # ✅ SAVE
    user.password = hashed_password

    db.session.commit()

    return jsonify({
        "message": "Password changed successfully"
    }), 200


# ================= UPLOAD PROFILE PICTURE =================
@user_bp.route('/upload-profile-pic', methods=['POST'])
@jwt_required()
def upload_profile_pic():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(f"user_{user_id}_{file.filename}")
        upload_folder = os.path.join(current_app.root_path, 'uploads/profile_pics')
        os.makedirs(upload_folder, exist_ok=True)

        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # Update database
        user.profile_pic = f"uploads/profile_pics/{filename}"
        db.session.commit()

        return jsonify({
            "message": "Profile picture uploaded successfully",
            "profile_pic": user.profile_pic
        })

    return jsonify({"error": "Invalid file type"}), 400


# ================= USER STATS =================
@user_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    user_id = int(get_jwt_identity())
    total_codes = CodeSubmission.query.filter_by(user_id=user_id).count()
    
    return jsonify({
        "codesAnalyzed": total_codes,
        "bugsFixed": total_codes * 2,
        "languages": "C,Python, Java, C++, JavaScript"
    })


# ================= DELETE ACCOUNT =================
@user_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message": "Account deleted successfully"
    }), 200