module.exports = (socketIo) => {
    socketIo.on('connect', (socket) =>{
        console.log("socket connect")
        const roomName = "test";

        socket.on("JOIN_ROOM", reqeustData => {
            socket.join(roomName);
            const responseData = {
                ...reqeustData,
                type: "JOIN_ROOM",
                time: new Date(),
            };

            socketIo.to(roomName).emit("RECEIVE_MESSAGE", responseData);
            console.log(`JOIN_ROOM is fired with data : ${JSON.stringify(responseData)}`)
        })

        socket.on("UPDATE_NICKNAME", requestData => {
            const responseData = {
                ...requestData,
                type: "UPDATE_NICKNAME",
                time: new Date(),
            };
            socketIo.to(roomName).emit("RECEIVE_MESSAGE", responseData);
            console.log(`UPDATE_NICKNAME is fired with data : ${JSON.stringify(responseData)}`);
        });

        socket.on("SEND_MESSAGE", requestData => {
            const responseData = {
                ...requestData,
                type: "SEND_MESSAGE",
                time: new Date(),
            };
            socketIo.to(roomName).emit("RECEIVE_MESSAGE", responseData);
            console.log(`SEND_MESSAGE is fired with data : ${JSON.stringify(responseData)}`)
        })
    });

    socketIo.on("disconnect", reason => {
        console.log("disconnect: ", reason)
    });


}