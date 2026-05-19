# backend/utils/code_executor.py
import subprocess
import tempfile
import os
import uuid

def execute_code(code, language, input_data=""):
    """
    Execute code in different languages safely
    """
    try:
        if language == "python":
            return execute_python(code, input_data)

        elif language == "java":
            return execute_java(code, input_data)

        elif language == "cpp":
            return execute_cpp(code, input_data)

        elif language == "c":
            return execute_c(code, input_data)

        elif language == "javascript":
            return execute_javascript(code, input_data)

        else:
            return {"error": f"Language '{language}' is not supported yet."}

    except subprocess.TimeoutExpired:
        return {"error": "Code execution timed out (5 seconds limit)"}
    except Exception as e:
        return {"error": f"Execution error: {str(e)}"}


def execute_python(code, input_data):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        result = subprocess.run(
            ['python3', temp_file],   # Use python3 for better compatibility
            input=input_data,
            capture_output=True,
            text=True,
            timeout=5
        )
        return {
            "output": result.stdout if result.returncode == 0 else "",
            "error": result.stderr if result.returncode != 0 else None
        }
    finally:
        if os.path.exists(temp_file):
            os.unlink(temp_file)


def execute_java(code, input_data):
    # For Java, we need to create a Main class and compile + run
    class_name = "Main"
    with tempfile.TemporaryDirectory() as tmpdir:
        java_file = os.path.join(tmpdir, f"{class_name}.java")
        
        # Ensure code has public class Main
        if "public class" not in code:
            code = f"public class {class_name} {{\n{code}\n}}"

        with open(java_file, 'w') as f:
            f.write(code)

        # Compile
        compile_result = subprocess.run(['javac', java_file], capture_output=True, text=True, timeout=5)
        if compile_result.returncode != 0:
            return {"compile_error": compile_result.stderr}

        # Run
        run_result = subprocess.run(
            ['java', '-cp', tmpdir, class_name],
            input=input_data,
            capture_output=True,
            text=True,
            timeout=5
        )

        return {
            "output": run_result.stdout,
            "error": run_result.stderr if run_result.returncode != 0 else None
        }


def execute_cpp(code, input_data):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.cpp', delete=False) as f:
        f.write(code)
        temp_file = f.name
        exe_file = temp_file.replace('.cpp', '.exe')

    try:
        # Compile
        compile_result = subprocess.run(['g++', temp_file, '-o', exe_file], 
                                      capture_output=True, text=True, timeout=5)
        if compile_result.returncode != 0:
            return {"compile_error": compile_result.stderr}

        # Run
        result = subprocess.run([exe_file], input=input_data, capture_output=True, text=True, timeout=5)
        
        return {
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else None
        }
    finally:
        for file in [temp_file, exe_file]:
            if os.path.exists(file):
                os.unlink(file)


def execute_c(code, input_data):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.c', delete=False) as f:
        f.write(code)
        temp_file = f.name
        exe_file = temp_file.replace('.c', '.exe')

    try:
        compile_result = subprocess.run(['gcc', temp_file, '-o', exe_file], 
                                      capture_output=True, text=True, timeout=5)
        if compile_result.returncode != 0:
            return {"compile_error": compile_result.stderr}

        result = subprocess.run([exe_file], input=input_data, capture_output=True, text=True, timeout=5)
        
        return {
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else None
        }
    finally:
        for file in [temp_file, exe_file]:
            if os.path.exists(file):
                os.unlink(file)


def execute_javascript(code, input_data):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        result = subprocess.run(
            ['node', temp_file],
            input=input_data,
            capture_output=True,
            text=True,
            timeout=5
        )
        return {
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else None
        }
    finally:
        if os.path.exists(temp_file):
            os.unlink(temp_file)