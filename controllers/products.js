const { response } = require("express");
const Product = require("../models/product");

// GetProducts - page - total - populate
const getProducts = async(req, res = response) => {

    // pagination is to asign specifics attributes to show in our response
    const { limit = 5, from = 0 } = req.query
    const query = { state: true }
    
    // We use Promise casue is more efficient and fast
    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate("user", "name")
            .populate("category", "name")
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ])

    res.json({
        total,
        products
    })
}

// GetProducts populate {}
const getProduct = async( req, res = response) => {
    
    const { id } = req.params
    const prodcuct = await Product.findById( id )
                            .populate("user", "name")
                            .populate("category", "name")

    res.json( prodcuct )
}

// CreateProduct
const CreateProduct = async( req, res = response ) => {

    // extract the name that is in the prodcuct
    const { state, user, ...body } = req.body

    // check if the product already exists
    const productDB = await Product.findOne({ name: body.name });

    if ( productDB ) {
        return res.status(400).json({
            message: `${ productDB.name } product already exists`
        })
    };

    // Create the data to store
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    };

    // prepare the data
    const prodcuct = new Product( data );

    // Save DB
    await prodcuct.save();

    res.status(201).json( prodcuct );
}

// UpdateProduct
const updateProduct = async (req, res = response ) => {

    const { id } = req.params

    const { state, user, ...data } = req.body

    if ( data.name ) {
        data.name = data.name.toUpperCase()
    }

    data.user = req.user._id

    const prodcuct = await Product.findByIdAndUpdate( id, data, { new: true } )

    res.json( prodcuct )
}

// Delete product - state = false
const deleteProduct = async (req, res = response ) => {

    const { id } = req.params
    const deletedProduct = await Product.findByIdAndUpdate( id, { state: false } , { new: true } )

    res.json( deletedProduct )
}

module.exports = {
    getProducts,
    getProduct,
    CreateProduct,
    updateProduct,
    deleteProduct
};
