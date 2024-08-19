from flask import Flask 
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask import Response
from flask import request
app = Flask(__name__) 
CORS(app,supports_credentials=True,resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

  
# Pass the required route to the decorator. 
from modules.login import login
from modules.items import items


app.config["JWT_SECRET_KEY"] = "$2a$12$QQTgiLL1SLMFJ3nqPmMBsehFO0hI67V1B4KNfgZSLOqY9n1h3k8Qa"  # Change this!

jwt = JWTManager(app)

app.register_blueprint(login)
app.register_blueprint(items)


@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()

if __name__ == "__main__": 
    app.run(debug=True) 
