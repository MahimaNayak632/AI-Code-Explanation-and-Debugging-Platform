# backend/run.py

from app import create_app

# Create the Flask application
app = create_app()

if __name__ == "__main__":
    print("AI Code Explanation and Debugging Platform Backend Started!")
    print("Running on http://localhost:5000")
    print("Press CTRL + C to stop the server\n")
    
    app.run(
        debug=True,      
        port=5000,
        host='0.0.0.0'  
    )