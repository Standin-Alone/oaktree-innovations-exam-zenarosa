from flask import Blueprint
from flask import request,jsonify
from db import get_db
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token

login = Blueprint('login',__name__, url_prefix='/api')


@login.route('/signin',methods=["POST","OPTIONS"])
@cross_origin()
def signin():        
    data = request.json
    cursor = get_db().cursor()
    query = cursor.execute("SELECT * from users where username = ? and password = ?",(data['username'], data['password']))        
    check_user = query.fetchall()

    if(len(check_user) != 0 ):
        access_token = create_access_token(identity=data['username'])
        return jsonify({"access_token": access_token, "message": "Successfully logged in!", "status": 'success'})
    else:                    
        return jsonify({"message": "Incorrect username or password!", "status": 'error'})