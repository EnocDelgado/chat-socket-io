
class Message {
    constructor( uid, name, message ) {
        this.uid        = uid;
        this.name       = name;
        this.message   = message;
    }
}

class ChatMessage {

    constructor() {

        this.messages = [];
        this.users    = {};
    }

    // get the last 10 messages
    get last10() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    // get users
    get usersArr() {
        return Object.values( this.users );
    }

    // send messages
    sendMessage( uid, name, message ) {
        this.messages.unshift(
            new Message( uid, name, message )
        )
    }

    conncetToUser( user ) {
        this.users[user.id] = user
    }

    disconnectToUser( id ) {
        delete this.users[id]
    }

}

module.exports = ChatMessage;