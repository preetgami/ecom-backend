const mongoose = require("mongoose")

const unquieValid = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    basket: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
    total: { type: String, required: true },
    ordered: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }]


})

UserSchema.plugin(unquieValid)

module.exports = mongoose.model("User", UserSchema)