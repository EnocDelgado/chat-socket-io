const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// HTML References
const txtUid = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers = document.querySelector('#ulUsers')
const ulMessages = document.querySelector('#ulMessage')
const btnLogout = document.querySelector('#btnLogout')

const validateJWT = async() => {

    const token = localStorage.getItem('token') || '';

    // validate the token
    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('Invalid token');
    }

    const resp = await fetch( url, {
         headers: { 'x-token': token }
    })
    
    // Save token in local storage
    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( 'token', tokenDB )
    user = userDB
    document.title = user.name;

    await conncetSocket()
}

const conncetSocket = async() => {

    // Connect to Backend server
    socket = io({
        'extreHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    //
    socket.on('connect', () => {
        console.log('Sockets online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })

    // know when a user recive a message
    socket.on('recive-messages', () => {

    })

    // Know when a user is active
    socket.on('online-users', ( payload ) => {
        console.log( payload );
    })

    // Know when a user is active
    socket.on('private-message', () => {
        
    })
}

const main = async() => {

    await validateJWT();
}

main();
