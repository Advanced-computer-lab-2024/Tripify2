const socketIO = require('socket.io');

let io = null;

module.exports = {
    init: (app) => {
        io = socketIO(app, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log('Client connected');

            socket.on('joinNotificationRoom', (userId) => {
                socket.join(userId);
            });

            socket.on('leaveNotificationRoom', (userId) => {
                socket.leave(userId);
            });
        });

        return io;
    },
    emit: (room, event, data) => {
        if (io) {
            io.to(room).emit(event, data);
        }
    }
};