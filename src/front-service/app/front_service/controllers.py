from flask import Blueprint, jsonify, session, render_template, flash, redirect, url_for, current_app, request, abort, Response
import requests, datetime
import json, pprint

# Define the blueprint: 'auth', set its url prefix: app.url/auth
api = Blueprint('api', __name__)


@api.route('/home/', methods=['GET'])
def dashboard():
    backend_response = requests.get(current_app.config.get('BASE_URL') + '/dashboard/',
                                    headers={"content-type": "application/json"})
    if backend_response.status_code==200:
        json_res = json.loads(backend_response.text)
        return render_template('dashboard.html', return_obj = json_res)
    elif backend_response.status_code==401:
        abort(500)


@api.route('/weather/', methods=['GET'])
def weather():
    backend_response = requests.get(current_app.config.get('BASE_URL') + '/weather/',
                                    headers={"content-type": "application/json"})
    if backend_response.status_code==200:
        json_res = json.loads(backend_response.text)
        return render_template('feed.html', return_obj = json_res)
    elif backend_response.status_code==401:
        abort(500)

