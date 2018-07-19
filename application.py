# import os
# import requests

# from flask import Flask, jsonify, render_template, request, url_for
# from flask_socketio import SocketIO, emit

# app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
# socketio = SocketIO(app)


# users = []

# @app.route("/")
# def index():
#     return render_template("index.html")

# @app.route("/populate", methods=["POST"])
# def populate():
#     print(channels)
#     return jsonify(channels)

# @socketio.on("add channel")
# def add(data):
#      name = data["name"]
#      channels.append(name)
#      emit("announce channels", {"name": name}, broadcast = True)
import os
import requests
import sys

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/populate", methods=["POST"])
def populate():
    return jsonify(channels)

@socketio.on("add channel")
def add(data):
    name = data["name"]
    channels.append(name)
    print(f"{name}", file=sys.stderr)
    emit("announce channels", {"name": name}, broadcast = True)
