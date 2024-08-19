import sqlite3

connection =  sqlite3.connect('my_db.db', check_same_thread=False)

def get_db():
    return connection