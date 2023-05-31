const HttpError = require("../models/http-error")
const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        console.log(token, "me")

        return next()
    }
    try {


        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            throw new Error("auth failed")
        }
        const decodedtoken = jwt.verify(token, "encryption password goes here")
        next()
        req.userData = { userId: decodedtoken.userId }

    } catch (err) {

        const error = new HttpError("authentication errro", 401)
        return next(error)
    }


}