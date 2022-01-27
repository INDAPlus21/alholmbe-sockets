const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8081 }, () => console.log('Server running on port 8081!'));

const users = new Set();
const recentMsgs = [];

server.on('connection', (socket) => {
    // keeping a reference to the "current" user
    const userReference = {
        socket: socket,
        lastActiveAt: Date.now(),
    };
    users.add(userReference);

    socket.on('message', (message) => {
        try {
            const parsedMsg = JSON.parse(message);

            if (typeof parsedMsg.sender !== 'string' || typeof parsedMsg.body !== 'string') {
                console.error(`Invalid message: ${message}`);
                return;
            }

            // check if the user is sending to many messages
            const numberOfrecentMsgs = recentMsgs.filter((message) => message.sender === parsedMsg.sender).length;
            if (numberOfrecentMsgs >= 30) {
                socket.close(4000, 'flooding the chat');
                return;
            }

            // 4. and if it is, send it!
            const verifiedMessage = {
                sender: parsedMsg.sender,
                body: parsedMsg.body,
                sentAt: Date.now(),
            };
            sendMsg(verifiedMessage);
            userReference.lastActiveAt = Date.now();
            recentMsgs.push(verifiedMessage);
            setTimeout(() => recentMsgs.shift(), 60000);
        } catch (error) {
            console.error('Error parsing message!', error);
        }
    });
    socket.on('close', (code, reason) => {
        console.log(`User disconnected with code ${code} because of ${reason}`);
        users.delete(userReference);
    });
});

const sendMsg = (msg) => {
    // sends the msg to all users
    for (const user of users) {
        user.socket.send(JSON.stringify(msg));
    }
};

setInterval(() => {
    const now = Date.now();

    // disconnect user after a period of inactivity
    for (const user of users) {
        if (user.lastActiveAt < now - 300000) {
            user.socket.close(4000, 'inactivity');
        }
    }
}, 10000);
