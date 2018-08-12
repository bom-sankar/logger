# Import flask
from flask import Flask, render_template

# Import Mongo Engine
#from flask_mongoengine import MongoEngine
from flask import jsonify

# Define the WSGI application object
app = Flask(__name__)

# Configurations
app.config.from_object('config')

# Define the database object which is imported
# by modules and controllers
#mongo = MongoEngine(app)

# Sample HTTP error handling
@app.errorhandler(404)
def error_page(error):
    return render_template('pages/samples/error-404.html')

# Sample HTTP error handling
@app.errorhandler(500)
def not_found(error):
    return render_template('pages/samples/error-500.html')
# Import a module / component using its blueprint handler variable (mod_auth)
from app.front_service.controllers import api as api_module

# Register blueprint(s)
app.register_blueprint(api_module)
# app.register_blueprint(xyz_module)
# ..

# Build the database:
# This will create the database file using SQLAlchemy
#db.create_all()