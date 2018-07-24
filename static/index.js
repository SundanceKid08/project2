
if (!localStorage.getItem('username'))
    localStorage.setItem('username', 'null');

document.addEventListener('DOMContentLoaded', () => {
      // Connect to websocket
    const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    const request = new XMLHttpRequest()

    onLoad(request)

    if (localStorage.getItem('username') != 'null')
        var list = document.getElementById('user_form')
        while (list.firstChild){
            list.removeChild(list.firstChild)
        }
        let label = document.createElement('label')
        label.innerHTML = localStorage.getItem('username')
        document.getElementById('user_name_display').appendChild(label)

    document.querySelector('#user_form').onsubmit = function() {
        var username = document.querySelector('#username').value
        localStorage.setItem('username', username)
        socket.emit('add user', {'username': username})
        return false
    }

    //when new chatroom name submitted emit to 'add channel' new channel name
    document.querySelector('#add_channel_form').onsubmit = () => {
        var name = document.querySelector('#chatroom_name').value
        localStorage.setItem('current_chatroom', name)
        socket.emit('add channel', {'name': name});
        return false;
    };

    document.querySelector('#chat_message_form').onsubmit = () => {
        var date = new Date()
        var zero = 0
        var message = document.querySelector('#message').value
        socket.emit('add message', {
            'message': message,
            'time': date.getHours().toString() + ":" + (date.getMinutes() < 10 ? zero.toString() + date.getMinutes() : date.getMinutes()),
            'channel': localStorage.getItem('current_chatroom'),
            'username': localStorage.getItem('username')
        });
        return false;
    };

    document.querySelector('#channel_select_form').onsubmit = () => {
        var chat_room = document.querySelector('#chat_list').value
        alert("chatroom changed to: " + chat_room)
        localStorage.setItem('current_chatroom', chat_room)
        socket.emit('change room', {'chat_room': chat_room})
        return false;
    }

    // //recieve a new channel
    socket.on('announce channels', data => {
        populateChannels(data);
    });

    socket.on('announce user', data => {
        populateUsers(data)
    });

    socket.on('announce message', data => {
        populateMessages(data)
    });

    socket.on('new chat room', data => {
       var list = document.getElementById('message_list')
       while (list.firstChild) {
            list.removeChild(list.firstChild)
       }
       populateMessages(data)
    });
});

//adds new elements to list in index.html
function addToList(list, value) {
    let newElement = document.querySelector(value).value;
    let li = document.createElement('li');
    li.innerHTML = newElement;
    document.querySelector(list).append(li);
}

function populateChannels(contents) {
    let li = document.createElement('option');
    li.innerHTML = `${contents.name}`;
    document.getElementById('chat_list').appendChild(li);
}

function populateUsers(contents) {
    let li = document.createElement('li');
    li.innerHTML = `${contents.username}`;
    document.querySelector('#user_list').append(li);
}

function populateMessages(contents) {
    if (typeof contents.message !== "undefined") {
        var li = document.createElement('li');
        li.innerHTML = `${contents.message}`;
        document.querySelector('#message_list').append(li);
    } else {
        return
    }
}

function writeChannel(name) {
     let li = document.createElement('option');
    li.innerHTML = name;
    document.getElementById('chat_list').appendChild(li);
}

function onLoad(request) {
    request.open('POST', '/chat_rooms')

    request.onload = () => {
        const data = JSON.parse(request.responseText)
        for(var x in data)
            writeChannel(x)
    }
    request.send()
}

function loadMessages(request) {
    request.open('POST', '/chat_log')

    request.onload = () => {
        const data = JSON.parse(request.responseText)
        for(var x in data)
            writeChannel(x)
    }
    request.send()
}


