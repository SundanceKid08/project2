
// document.addEventListener('DOMContentLoaded', () => {
//     alert("hello")
//     //load active channels
//     onStart();

//     //get cached username
//     var username = localStorage.getItem('username');

//     //if user does not have name cached
//     if (username == 'null') {
//         console.log("anything");
//         //create new username
//         document.querySelector('#form').onsubmit = () => {
//             localStorage.setItem('username', username);
//             addToList('#users_list', '#username', 'list-group-item');
//             var myNode = document.getElementById("form");
//             while (myNode.firstChild) {
//                 myNode.removeChild(myNode.firstChild);
//             }
//             return false;
//         };
//     //else in case of username already exist welcome user and remove
//     //username entry nodes
//     } else {
//         var myNode = document.getElementById("form");
//         while (myNode.firstChild) {
//             myNode.removeChild(myNode.firstChild);
//         }
//         addToList('#users_list', username, 'list-group-item');
//     }

//     //OLD CODE PROBABLY NO USEFUL
//     //user input for new channel creation
//     // document.querySelector('#form_chat').onsubmit = () => {
//     //     addToList('#chat_list', '#chatroom_name', 'list-group-item');
//     //     return false;
//     // };


//     //connect to socket
//     var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

//     //when new chatroom name submitted emit to 'add channel' new channel name
//     socket.on('connect', () => {
//         document.querySelector('#form').onsubmit = () => {
//             const name = '#chatroom_name';
//             socket.emit('add channel', {'name': name});
//             return false;
//         };
//     });

//     // //recieve a new channels created
//     socket.on('announce channels'), data => {
//         populateChannels(data.name);
//     };

// });

// //####################################################################################
// //####################################################################################

// function populateChannels(contents) {
//     let li = document.createElement('li');
//     li.className = 'list-group-item';
//     li.innerHTML = {"contents": contents};
//     document.querySelector('#chat_list').append(li);
// }

// //adds new elements to list in index.html
// function addToList(list, value, className) {
//     let newElement = document.querySelector(value).value;
//     let li = document.createElement('li');
//     li.className = className;
//     li.innerHTML = newElement;
//     document.querySelector(list).append(li);
// }

// //load new channels on start
// function onStart() {
//     const request = new XMLHttpRequest();
//     request.open('POST', '/populate');
//     request.onload = () => {
//         const data = JSON.parse(request.responseText);
//         data.forEach(populateChannels);
//     };
// }



    if (!localStorage.getItem('username'))
            localStorage.setItem('username', null);


document.addEventListener('DOMContentLoaded', () => {
    var username = localStorage.getItem('username')

    document.querySelector('#form').onsubmit = function() {
        localStorage.setItem('username', username);
            addToList('#users_list', '#username', 'list-group-item');
            var myNode = document.getElementById("form");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
        return false
    };


    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //when new chatroom name submitted emit to 'add channel' new channel name

    document.querySelector('#form_chat').onsubmit = () => {
        alert("new chat submitted")
        var name = 'chatroom_name';
        socket.emit('add channel', {'name': name});
        return false;
    };


    // //recieve a new channels created
    socket.on('announce channels'), data => {
        alert("announce channels")
        populateChannels(data.name);
    };

});

//adds new elements to list in index.html
function addToList(list, value, className) {
    let newElement = document.querySelector(value).value;
    let li = document.createElement('li');
    li.className = className;
    li.innerHTML = newElement;
    document.querySelector(list).append(li);
}

function populateChannels(contents) {
    let li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = {"contents": contents};
    document.querySelector('#chat_list').append(li);
}