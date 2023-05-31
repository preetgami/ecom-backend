const express = require("express")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const userRoutes = require("./routes/user-routes")
const productsRoutes = require("./routes/products-routes")
const HttpError = require("./models/http-error")
const stripe = require("./routes/stripe")
const app = express()
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, Authorization,")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST, PATCH, DELETE")
    next()
})

app.use("/api/users", userRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/stripe", stripe)


app.use((req, res, next) => {
    const error = new HttpError("NO ROUTES LIKE THIS EXISTS!", 404)
    throw error
})
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || "Unknown error occured" })
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.ekohyyj.mongodb.net/?retryWrites=true&w=majority`).then(
    () => app.listen(5000)
).catch(err => console.log("i found an error"))