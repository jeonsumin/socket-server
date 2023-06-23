const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/socket.html");
})

var nsp = io.of('/test')

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function(socket) {

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function(data) {

        // console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
        console.log('Client logged-in:\n data:', data );

        // socket에 클라이언트 정보를 저장한다
        socket.name = data;
        socket.userid = data;

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit('login', data );
    });

    // 클라이언트로부터의 메시지가 수신되면
    socket.on('chat', function(data) {
        console.log('Message from %s: %s', socket.name, data);

        var msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data
        };

        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        // io.emit('s2c chat', msg);

        // 특정 클라이언트에게만 메시지를 전송한다
        // io.to(id).emit('s2c chat', data);
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function() {
        socket.disconnect();
    })

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket.name);
    });
});

server.listen(port, () => console.log("listening on port ", port) )