const { validationResult } = require("express-validator")
const Httperror = require("../models/http-error")
const bycrpt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const signup = async (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return next(new Httperror("Invalid signup credntials", 422))
    }
    const { name, email, password } = req.body
    let existinguser;
    try {
        existinguser = await User.findOne({ email: email })

    } catch (err) {
        const error = new Httperror("signup failed try later", 500)
        return next(error)
    }

    if (existinguser) {
        const error = new Httperror("user already exists", 422)
        return next(error)
    }

    let hashedpass
    try {

        hashedpass = await bycrpt.hash(password, 12)
        //console.log(hashedpass)

    } catch (err) {
        const error = new Httperror("could not make user", 500)
        return next(error)
    }
    const creeadteduser = new User({
        name,
        email,
        password: hashedpass,
        basket: [],
        total: 0,
        ordered: []
    })

    try {
        await creeadteduser.save()
    } catch (err) {
        const error = new Httperror("failed creating user", 500)
        return next(error)
    }
    let token;
    try {
        token = jwt.sign({ userId: creeadteduser.id, email: creeadteduser.email }, `${process.env.JWT_KEY}`, { expiresIn: "1h" })
    } catch (err) {
        const error = new Httperror("failed creating user token", 500)

        return next(error)
    }
    res.status(201).json({ userId: creeadteduser.id, email: creeadteduser.email, token: token });

}

const login = async (req, res, next) => {
    const { email, password } = req.body
    let existinguser;
    try {
        existinguser = await User.findOne({ email: email })
    } catch (err) {
        const error = new Httperror("log in failed", 500)
        return next(error)
    }
    let isvalidpass = false
    try {
        isvalidpass = await bycrpt.compare(password, existinguser.password)


    } catch (err) {
        const error = new Httperror("log in failed we had an error", 500)
        return next(error)
    }

    if (!existinguser) {
        const error = new Httperror("crednetials are wrong", 500)
        return next(error)
    }
    if (!isvalidpass) {

        const error = new HttpError("credentioals wrong in failed try later", 401)
        return next(error)
    }
    let token;
    try {
        token = jwt.sign({ userId: existinguser.id, email: existinguser.email }, `${process.env.JWT_KEY}`, { expiresIn: "1h" })
    } catch (err) {
        const error = new HttpError("log in failed we had an error", 500)
        return next(error)
    }
    res.json({
        userId: existinguser.id,
        email: existinguser.email,
        token: token
    })

}

exports.signup = signup
exports.login = login
