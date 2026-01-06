import sqlite3

def init_db():
    connection = sqlite3.connect('trazabilidad.db')
    with open('database/schema.sql') as f:
        connection.executescript(f.read())
    connection.commit()
    connection.close()
    print("Base de datos inicializada correctamente.")

if __name__ == '__main__':
    init_db()