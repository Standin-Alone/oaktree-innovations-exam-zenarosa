from flask import Blueprint
from flask import request
from db import get_db
from flask import jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin

items = Blueprint('items',__name__, url_prefix='/api/items')





@items.route('/',methods = ['GET', 'POST', "OPTIONS"], defaults = {"id": 0})
@items.route('/<int:id>',methods = ['GET',"PUT",'DELETE', "OPTIONS"])
@cross_origin()
@jwt_required()

def index(id):       
    if(id != 0):    
        # get one item
        if request.method == 'GET':            
            cursor = get_db().cursor()
            cursor.execute('''SELECT * FROM r_items where id = ?''',(id,))        
            columns = cursor.description     
            response = [{columns[index][0]:column for index, column in enumerate(value)} for value in cursor.fetchall()]
            cursor.close()    
            return jsonify(response)
        # update items
        if request.method == "PUT":
            data = request.json    
            if ("name" in data and "description" in data and "price" in data):
                if(len(data['name']) != 0 and len(data['description']) != 0 and data['price'] >= 0):    
                    cursor = get_db().cursor()
                    conn = get_db()
                    cursor.execute("UPDATE r_items SET name = ?, description = ?, price = ? where id = ?",(data['name'], data['description'], data['price'], id))
                    conn.commit()
                    cursor.close()
                    return "Successfully updated."
                else:
                    return "Some parameter has no values." 
            else:
                return "Invalid payload."                      
        # delete item
        if request.method == "DELETE":
            cursor = get_db().cursor()
            conn = get_db()
            cursor.execute("DELETE FROM r_items where id = ?",(id,))
            conn.commit()
            cursor.close()            
            return "Successfully deleted."             
    else:         
        # select items
        if request.method == 'GET':                            
            cursor = get_db().cursor()      
            get_items = cursor.execute('''SELECT * FROM r_items order by created_at DESC''')            
            columns = cursor.description 
            response = [{columns[index][0]:column for index, column in enumerate(value)} for value in get_items.fetchall()]

            cursor.close()
            return response         
        # insert items   
        if request.method == 'POST':
            data = request.json            
            if ( "name" in data and "description" in data and "price" in data):
                if(len(data['name']) != 0 and len(data['description']) != 0 and data['price'] >= 0):                     
                    cursor = get_db().cursor()
                    conn = get_db()
                    cursor.execute("INSERT INTO r_items(name, description, price) VALUES(?, ?, ?)",(data['name'], data['description'], data['price']))
                    conn.commit()
                    cursor.close()
                    return "Successfully inserted."
                else:
                    return "Some parameter has no values."
            else:
                return "Invalid payload."                

    return 'true'

