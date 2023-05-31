const mongoose = require("mongoose")
const uniquevalidator = require("mongoose-unique-validator")

const Schema = mongoose.Schema

const prodctsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true }

})
prodctsSchema.plugin(uniquevalidator)
module.exports = mongoose.model("Product", prodctsSchema)



/// do i need this
//perhaps get all products. for shop

//get all products for a user

//ask user to log in

// then use it 