const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
})

let activeEmails = [];


io.on("connection", socket => {
    let uroomId = [];
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        uroomId = roomId;
        if(!activeEmails.includes(userId)){
            activeEmails.push({email:userId, id: socket.id});
        }
        console.log(activeEmails, 'activeEmails')
        io.in(roomId).emit('new-user', activeEmails);
    })
    
    socket.on('send-changes', ({roomId, delta})=>{
        socket.to(roomId).emit('receive-changes', delta);
    });
    socket.on('leave-room', (roomId, userId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user-left', userId);
    })
    socket.on('disconnect', ()=> {
        console.log('User disconnected', socket.id);
        const filteredEmails = activeEmails.filter((({id}) => id !== socket.id))
        activeEmails = filteredEmails;
        io.in(uroomId).emit('new-user', activeEmails);

    })
})