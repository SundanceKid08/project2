
import os
import requests
import sys

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}
users = {}
success = {'success': True}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/populate", methods=["POST"])
def populate():
    return jsonify(**channels)

@app.route("/chat_rooms", methods=["POST"])
def loadChatRooms():
    return jsonify(channels)

@app.route("/chat_log", methods=["POST"])
def loadChatLog():
    channel_name = request.form.get("name")
    print(channel_name, file=sys.stderr)
    print(channels[channel_name], file=sys.stderr)
    return jsonify(channels[channel_name])


@socketio.on("add channel")
def addChannel(data):
    name = data["name"]
    if(name not in channels):
        channels[name] = {}
        emit("announce channels", {"name": name}, broadcast = True)

@socketio.on("add user")
def addUser(data):
    username = data["username"]
    if(username not in users):
        users[username] = {}

@socketio.on("add message")
def addMessage(data):
    username = data["username"]
    timestamp = data["time"]
    message = data["message"]
    channel = data["channel"]
    i = len(channels[channel])
    n = (i % 100)
    channels[channel][n] = username + " | " + str(timestamp) + " : " + message
    i += 1
    emit("announce message", {"message": f'{channels[channel][n]}'}, broadcast = True)

@socketio.on("change room")
def changeRoom(data):
    emit("new chat room", channels[data["chat_room"]], broadcast = True)


@socketio.on("startup")
def startup():
    for key, value in channels.items():
        emit("announce channels", {"name": key}, broadcast = True)


