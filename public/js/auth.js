// HTML References
const myForm = document.querySelector('form')

const url = ( window.location.hostname.includes('localhost') ) 
                ? 'http://localhost:8080/api/auth/'
                : 'http://restserver-curso-fher.herokuapp.com/api/auth/'

// Avoid reload page
myForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = {};

    for ( let form of myForm.elements ) {
        if ( form.name.length > 0 ) {
            formData[form.name] = form.value
        }
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then( resp => resp.json() )
        .then( ({ msg, token }) => {
            if ( msg ) {
                return console.error( msg )
            } 

            localStorage.setItem( 'token', token )
            window.location = 'chat.html';
        })  
        .catch( console.log )

    
})

function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
 //    console.log( 'id_token', response.credential )

    const body = { id_token: response.credential }

    // Get credentials
    fetch( url + 'google', {
        method: 'POST',
        body: JSON.stringify( body ),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then( resp => resp.json() )
        .then( ({ token })=> {
            // console.log( resp )
            localStorage.setItem( 'token', token )
            window.location = 'chat.html';
        })
        .catch( console.log )
    }

    // Create an function that end session
    const button = document.getElementById('google-signout')
    button.onclick = () => {
        google.accounts.id.disableAutoSelect()

        google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {
            localStorage.clear();
            // Reload to reload end get empty the page 
            location.reload()
        } )
 }