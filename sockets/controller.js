const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers/generate-jwt');
const ChatMessage = require('../models/chat-message');

const chatMessage = new ChatMessage();

const socketController = async( socket = new Socket(), io ) => {

    const user = await checkJWT( socket.handshake.headers['x-token'] )

    if ( !user ) {
        return socket.disconnect();
    }

    // add online user
    chatMessage.conncetToUser( user );
    io.emit('online-users', chatMessage.usersArr )

    // clear when someone is online
    socket.on('disconnect', () => {
        chatMessage.disconnectToUser( user.id );
        io.emit('online-users', chatMessage.usersArr )
    })
    
}

module.exports = {
    socketController
}