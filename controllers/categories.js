const { response } = require("express");
const Category = require("../models/category");

// GetCategories - page - total - populate
const getCategories = async(req, res = response) => {

    // pagination is to asign specifics attributes to show in our response
    const { limit = 5, from = 0 } = req.query
    const query = { state: true }
    
    // We use Promise casue is more efficient and fast
    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .populate("user", "name")
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ])

    res.json({
        total,
        categories
    })
}

// GetCategory populate {}
const getCategory = async( req, res = response) => {
    
    const { id } = req.params
    const category = await Category.findById( id ).populate("user", "name")

    res.json( category )
}

// CreateCategory
const createCategory = async( req, res = response ) => {

    // extract the name that is in the category
    const name = req.body.name.toUpperCase();

    // check if the category already exists
    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
        return res.status(400).json({
            message: `${ categoryDB.name } category already exists`
        })
    };

    // Create the data to store
    const data = {
        name,
        user: req.user._id
    };

    // prepare the data
    const category = new Category( data );

    // Save DB
    await category.save();

    res.status(201).json( category );
}

// UpdateCategory
const updateCategory = async (req, res = response ) => {

    const { id } = req.params
    const { state, user, ...data } = req.body

    data.name = data.name.toUpperCase()
    data.user = req.user._id

    const category = await Category.findByIdAndUpdate( id, data, { new: true } )

    res.json( category )
}

// Delete category - state = false
const deleteCategory = async (req, res = response ) => {

    const { id } = req.params
    const deletedCategory = await Category.findByIdAndUpdate( id, { state: false } , { new: true } )

    res.json( deletedCategory )
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};