const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require("express");
const { uploadFile } = require("../helpers");

const { User, Product } = require("../models");

const uploadfile = async( req, res = response ) => {

    try {

        // Images
        // const name = await uploadFile( req.files, ['txt', 'md'], 'texts' );
        const name = await uploadFile( req.files, undefined, 'imgs' );

        res.json({ name });

    } catch ( error ) {
        res.status(400).json({ msg })
    }
    
}


const updateImage = async( req, res = response ) => { 

    const { id, collection } = req.params;

    let model ;

    // verify if exists users and collection
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `Does not exist user id ${ id }`
                })
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `Does not exist user id ${ id }`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'It forgot to validate this'})
    }

    

    // Clear previous images
    if ( model.img ) {
        // Delete image in the database
        const pathImage = path.join( __dirname, '../uploads/', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            fs.unlinkSync( pathImage );
        }
    }

    const name = await uploadFile( req.files, undefined, collection );
    model.img = name;

    await model.save();

    res.json( model );
}

const updateImageCloudinary = async( req, res = response ) => { 

    const { id, collection } = req.params;

    let model ;

    // verify if exists users and collection
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `Does not exist user id ${ id }`
                })
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `Does not exist user id ${ id }`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'It forgot to validate this'})
    }

    

    // Clear previous images
    if ( model.img ) {
        // Get the id of our image
        const nameArr = model.img.split('/');
        const name    = nameArr[nameArr.length - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.doc
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;

    await model.save();

    res.json( model );
}

// Display images in our server
const displayImage = async( req, res = response ) => { 
    
    const { id, collection } = req.params;

    let model ;

    // verify if exists users and collection
    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `Does not exist user id ${ id }`
                })
            }
        break;

        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `Does not exist user id ${ id }`
                })
            }
        break;

        default:
            return res.status(500).json({ msg: 'It forgot to validate this'})
    }

    

    // Clear previous images
    if ( model.img ) {
        // Delete image in the database
        const pathImage = path.join( __dirname, '../uploads/', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            return res.sendFile( pathImage )
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.png')
    res.sendFile( pathImagen )

}

module.exports = {
    uploadfile,
    updateImage,
    displayImage,
    updateImageCloudinary
}