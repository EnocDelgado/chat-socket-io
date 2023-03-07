const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

    return new Promise( (resolve, reject) => {

        // file uploaded
        const { doc } = files;
        const nameSplited = doc.name.split('.');
        const extension = nameSplited[ nameSplited.length - 1 ];
    
        // validate extension
        if ( !validExtensions.includes( extension ) ) {
           return reject(`The ${ extension } extension is not supported - ${ validExtensions }`);
        }
        
        // Temporary name
        const provisionalName = uuidv4() + '.' + extension;
      
        // use path to directing to the route
        const uploadPath = path.join( __dirname, '../uploads/', folder, provisionalName );
      
        doc.mv( uploadPath, (err) => {
            if ( err ) {
                reject( err );
            }
        
            resolve( provisionalName );
        });
    });

}

module.exports = {
    uploadFile
}