# backend/routes/community.py
from flask import Blueprint, jsonify
from models import CodeSubmission

community_bp = Blueprint('community', __name__)

# Get all public codes for Community page
@community_bp.route('/codes', methods=['GET'])
def get_community_codes():
    try:
        public_codes = CodeSubmission.query.filter_by(is_public=True)\
            .order_by(CodeSubmission.created_at.desc()).limit(100).all()

        result = []
        for code in public_codes:
            result.append({
                "id": code.id,
                "title": code.title or "Untitled Code",
                "language": code.language,
                "codeSnippet": code.code[:200] + "..." if len(code.code) > 200 else code.code,
                "description": code.description or "No description provided",
                "author": "Anonymous",           # Later you can join with User table
                "time": code.created_at.strftime("%b %d, %Y"),
                "likes": 0,                      # You can add like system later
                "views": 0,
                "comments": 0
            })

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": "Failed to fetch community codes"}), 500