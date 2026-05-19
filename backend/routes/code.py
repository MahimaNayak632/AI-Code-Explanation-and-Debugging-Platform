# backend/routes/code.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CodeSubmission
from utils.code_executor import execute_code
from utils.ai_helper import analyze_code_with_ai


code_bp = Blueprint('code', __name__)

# ================= RUN CODE =================
@code_bp.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code')
    language = data.get('language')
    input_data = data.get('input', '')

    if not code or not language:
        return jsonify({"error": "Code and language are required"}), 400

    result = execute_code(code, language, input_data)
    return jsonify(result)


# ================= AI ANALYZE (Explain + Debug) =================
# @code_bp.route('/analyze', methods=['POST'])
# def analyze_code():
#     data = request.get_json()
#     code = data.get('code')
#     language = data.get('language')

#     if not code or not language:
#         return jsonify({"error": "Code and language are required"}), 400

#     try:
#         ai_result = analyze_code_with_ai(code, language)
#         return jsonify(ai_result)
#     except Exception as e:
#         return jsonify({
#             "explanation": "Sorry, AI analysis failed at the moment.",
#             "error": str(e),
#             "suggestion": "Please try again later."
#         }), 500


# ================= AI ANALYZE (Explain + Debug) =================
@code_bp.route('/analyze', methods=['POST'])
def analyze_code():
    data = request.get_json()
    code = data.get('code')
    language = data.get('language')
    from utils.ai_helper import detect_language
    detected_language = detect_language(code)
    if detected_language != "unknown": language = detected_language

    

    if not code or not language:
        return jsonify({"error": "Code and language are required"}), 400

    try:
        # First, try to run the code to catch compile/runtime errors
        from utils.code_executor import execute_code
        execution_result = execute_code(code, language, "")

        ai_result = analyze_code_with_ai(code, language)

        # Merge real execution errors with AI analysis
        if execution_result.get('compile_error'):
            ai_result['errors'].insert(0, f"Compile Error: {execution_result['compile_error']}")
        elif execution_result.get('error'):
            ai_result['errors'].insert(0, f"Runtime Error: {execution_result['error']}")

        return jsonify(ai_result)

    except Exception as e:
        return jsonify({
            "explanation": "Sorry, AI analysis failed.",
            "errors": [str(e)],
            "warnings": [],
            "suggestions": []
        }), 500






# ================= SAVE CODE (Private) =================
@code_bp.route('/save', methods=['POST'])
@jwt_required()
def save_code():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    new_submission = CodeSubmission(
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        code=data.get('code'),
        language=data.get('language'),
        is_public=False
    )

    db.session.add(new_submission)
    db.session.commit()

    return jsonify({"message": "Code saved successfully", "id": new_submission.id})


# ================= SHARE TO COMMUNITY =================
@code_bp.route('/share', methods=['POST'])
@jwt_required()
def share_code():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    new_submission = CodeSubmission(
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        code=data.get('code'),
        language=data.get('language'),
        is_public=True   # Important: This makes it visible in Community
    )

    db.session.add(new_submission)
    db.session.commit()

    return jsonify({
        "message": "Code shared to community successfully!",
        "id": new_submission.id
    })


# ================= GET USER SUBMISSIONS =================
@code_bp.route('/submissions', methods=['GET'])
@jwt_required()
def get_submissions():
    user_id = int(get_jwt_identity())
    submissions = CodeSubmission.query.filter_by(user_id=user_id).order_by(CodeSubmission.created_at.desc()).all()

    result = []
    for sub in submissions:
        result.append({
            "id": sub.id,
            "title": sub.title,
            "language": sub.language,
            "is_public": sub.is_public,
            "created_at": sub.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(result)


# ================= GET COMMUNITY PUBLIC CODES =================
# @code_bp.route('/community', methods=['GET'])   # Note: This will be moved to community.py later
# def get_community_codes():
#     public_codes = CodeSubmission.query.filter_by(is_public=True)\
#         .order_by(CodeSubmission.created_at.desc()).limit(50).all()

#     result = []
#     for code in public_codes:
#         result.append({
#             "id": code.id,
#             "title": code.title or "Untitled Code",
#             "language": code.language,
#             "codeSnippet": code.code[:150] + "..." if len(code.code) > 150 else code.code,
#             "description": code.description,
#             "author": "Anonymous",   # You can join with User table later
#             "time": code.created_at.strftime("%Y-%m-%d"),
#             "likes": 0,   # You can add like system later
#             "views": 0
#         })

#     return jsonify(result)



# ================= GET COMMUNITY PUBLIC CODES =================
@code_bp.route('/community', methods=['GET'])
def get_community_codes():

    public_codes = CodeSubmission.query.filter_by(is_public=True)\
        .order_by(CodeSubmission.created_at.desc()).limit(50).all()

    result = []

    for code in public_codes:

        result.append({
            "id": code.id,
            "title": code.title or "Untitled Code",
            "language": code.language,

            # FULL CODE
            "code": code.code,

            # SHORT PREVIEW
            "codeSnippet": code.code[:800] + "..." if len(code.code) > 800 else code.code,

            "description": code.description,
            "author": "Anonymous",
            "time": code.created_at.strftime("%Y-%m-%d"),
            "likes": 0,
            "views": 0
        })

    return jsonify(result)

