

# import requests
# import os
# import json

# def analyze_code_with_ai(code, language):
#     try:
#         api_key = os.getenv("GROQ_API_KEY")

#         if not api_key:
#             raise Exception("Groq API key missing")

#         url = "https://api.groq.com/openai/v1/chat/completions"

#         prompt = f"""
# Analyze this {language} code and return JSON:

# {{
#   "explanation": "simple explanation",
#   "errors": ["list errors"],
#   "suggestions": ["fixes"]
# }}

# Code:
# {code}
# """

#         headers = {
#             "Authorization": f"Bearer {api_key}",
#             "Content-Type": "application/json"
#         }

#         payload = {
#             "model": "llama3-70b-8192",
#             "messages": [
#                 {"role": "system", "content": "You are a strict code debugger"},
#                 {"role": "user", "content": prompt}
#             ],
#             "temperature": 0.3
#         }

#         res = requests.post(url, headers=headers, json=payload)
#         data = res.json()

#         text = data["choices"][0]["message"]["content"]

#         try:
#             return json.loads(text)
#         except:
#             return {
#                 "explanation": text,
#                 "errors": [],
#                 "suggestions": []
#             }

#     except Exception as e:
#         print("GROQ ERROR:", e)

#         # 🔥 fallback (VERY IMPORTANT for presentation)
#         return {
#             "explanation": "This code has a syntax error.",
#             "errors": ["Check missing brackets or syntax issues"],
#             "suggestions": ["Fix syntax and try again"]
#         }



# import requests
# import os
# import json

# def analyze_code_with_ai(code, language):
#     try:
#         api_key = os.getenv("GROQ_API_KEY")

#         if not api_key:
#             raise Exception("Groq API key missing")

#         url = "https://api.groq.com/openai/v1/chat/completions"


#         #         prompt = f"""
# # Return ONLY JSON:

# # {{
# #   "explanation": "...",
# #   "errors": ["..."],
# #   "suggestions": ["..."],
# #   "fixed_code": "corrected code"
# # }}

# # Code:
# # {code}
# # """

# prompt = f"""
# You are a strict code debugger.

# Analyze the following {language} code.

# IMPORTANT:
# - You MUST return ONLY valid JSON
# - Do NOT include any extra text
# - Do NOT explain outside JSON

# Format:

# {{
#   "explanation": "Explain clearly",
#   "errors": ["List all errors"],
#   "suggestions": ["How to fix"],
#   "fixed_code": "FULL corrected working code"
# }}

# Code:
# {code}
# """

# headers = {
#         "Authorization": f"Bearer {api_key}",
#         "Content-Type": "application/json"
#         }

# payload = {
#             "model": "llama3-70b-8192",
#             "messages": [
#                 {"role": "system", "content": "You are a strict code debugger"},
#                 {"role": "user", "content": prompt}
#             ],
#             "temperature": 0.2
#         }
# res = requests.post(url, headers=headers, json=payload)
# data = res.json()

# text = data["choices"][0]["message"]["content"]

# try:
#     return json.loads(text)
# except:
#     return {
#         "explanation": text,
#         "errors": [],
#          "suggestions": [],
#         "fixed_code": code
#         }

# except Exception as e:
#  print("GROQ ERROR:", e)

# return {
#     "explanation": "This code has a syntax error.",
#     "errors": ["Check missing brackets or syntax issues"],
#     "suggestions": ["Fix syntax and try again"],
#     "fixed_code": code
#     }




# import requests
# import os
# import json

# def analyze_code_with_ai(code, language):
#     try:
#         api_key = os.getenv("GROQ_API_KEY")

#         if not api_key:
#             raise Exception("Groq API key missing")

#         url = "https://api.groq.com/openai/v1/chat/completions"

#         prompt = f"""
# You are a strict code debugger.

# Analyze the following {language} code.

# IMPORTANT:
# - You MUST return ONLY valid JSON
# - Do NOT include extra text
# - Do NOT explain outside JSON

# Format:

# {{
#   "explanation": "Explain clearly",
#   "errors": ["List all errors"],
#   "suggestions": ["How to fix"],
#   "fixed_code": "FULL corrected working code"
# }}

# Code:
# {code}
# """

#         headers = {
#             "Authorization": f"Bearer {api_key}",
#             "Content-Type": "application/json"
#         }

#         payload = {
#             "model": "llama3-70b-8192",
#             "messages": [
#                 {
#                     "role": "system",
#                     "content": "You are a strict code debugger"
#                 },
#                 {
#                     "role": "user",
#                     "content": prompt
#                 }
#             ],
#             "temperature": 0.2
#         }

#         res = requests.post(url, headers=headers, json=payload)

#         data = res.json()

#         text = data["choices"][0]["message"]["content"]

#         # CLEAN AI RESPONSE
#         text = text.replace("```json", "").replace("```", "").strip()

#         print("RAW AI RESPONSE:", text)

#         try:
#             return json.loads(text)

#         except Exception as e:
#             print("JSON ERROR:", e)

#             return {
#                 "explanation": text,
#                 "errors": ["AI response format issue"],
#                 "suggestions": ["Check AI formatting"],
#                 "fixed_code": code
#             }

#     except Exception as e:
#         print("GROQ ERROR:", e)

#         return {
#             "explanation": "This code has a syntax error.",
#             "errors": ["Check missing brackets or syntax issues"],
#             "suggestions": ["Fix syntax and try again"],
#             "fixed_code": code
#         }



import requests
import os
import json
import re
def detect_language(code):

    code = code.lower()

    # PYTHON
    if "print(" in code and "def " in code:
        return "python"

    if "range(" in code:
        return "python"

    # JAVA
    if "public class" in code:
        return "java"

    if "system.out.println" in code:
        return "java"

    # JAVASCRIPT
    if "console.log" in code:
        return "javascript"

    # C
    if "#include<stdio.h>" in code:
        return "c"

    # CPP
    if "#include<iostream>" in code:
        return "cpp"

    return "unknown"





def analyze_code_with_ai(code, language):
    detected_language = detect_language(code)
    if detected_language != "unknown": language = detected_language
    

    try:
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise Exception("Groq API key missing")

        url = "https://api.groq.com/openai/v1/chat/completions"

        prompt = f"""
You are an expert programming debugger.

Analyze this {language} code.

IMPORTANT RULES:

- Return ONLY valid JSON
- No markdown
- No extra text

- If code is already correct:
  - Keep fixed_code SAME as original code
  - Do NOT add unnecessary try-catch
  - Do NOT rewrite logic
  - Do NOT make code longer
  - Do NOT rename classes/functions unnecessarily

- Only fix REAL errors
- Keep corrections minimal
- Preserve original structure whenever possible

- fixed_code MUST:
  - contain FULL corrected code
  - be properly indented
  - contain real line breaks
  - NOT be in one line


JSON FORMAT:

{{
  "language": "{language}",
  "explanation": [
    "Step 1 explanation",
    "Step 2 explanation"
  ],
   "errors": [
    "Error 1"
  ],
   "suggestions": [
    "Suggestion 1"
  ],
  "fixed_code": "FULL corrected code"
}}
Code:
{code}
"""

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional code debugger"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0
        }

        response = requests.post(
            url,
            headers=headers,
            json=payload
        )

        data = response.json()

        print("FULL API RESPONSE:")
        print(data)

        if "choices" not in data:

            return {
                "language": language,
                "explanation": ["AI API failed"],
                "errors": [str(data)],
                "suggestions": ["Check API key or quota"],
                "fixed_code": code
            }

        text = data["choices"][0]["message"]["content"]

        print("RAW AI RESPONSE:")
        print(text)

        # REMOVE MARKDOWN
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        # FIX INVALID CONTROL CHARACTERS
        text = re.sub(r'[\x00-\x1F]+', ' ', text)

        try:

            result = json.loads(text)
            if "fixed_code" in result:
                fixed = result["fixed_code"]
                # Convert escaped characters
                fixed = fixed.replace("\\n", "\n")
                fixed = fixed.replace("\\t", "    ")
                fixed = fixed.replace('\\"', '"')
                 # Python formatting
                if language == "python":
                    fixed = fixed.replace("for ", "\nfor ")
                    fixed = fixed.replace("if ", "\n    if ")
                    fixed = fixed.replace("elif ", "\n    elif ")
                    fixed = fixed.replace("else:", "\n    else:")
                    fixed = fixed.replace("print(", "\n        print(")
                    # Java/C/C++ formatting
                else:
                    fixed = fixed.replace("{", "{\n")
                    fixed = fixed.replace(";", ";\n")
                    fixed = fixed.replace("}", "\n}\n")
                    # Remove extra blank lines
                fixed = "\n".join(
                    line.rstrip()
                    for line in fixed.splitlines()
                    if line.strip() != ""
                )
                
                

            if not result.get("fixed_code"):
                result["fixed_code"] = code

            return result

        except Exception as json_error:

            print("JSON ERROR:", json_error)

            # RETURN RAW AI TEXT
            return {
                "language": language,
                "explanation": ["AI returned invalid JSON"],
                "errors": [str(json_error)],
                "suggestions": ["JSON parsing failed but AI generated response"],
                "fixed_code": text
            }

    except Exception as e:

        print("GROQ ERROR:", e)

        return {
            "language": language,
            "explanation": ["Backend AI error"],
            "errors": [str(e)],
            "suggestions": ["Check backend or API"],
            # "fixed_code": code
        }