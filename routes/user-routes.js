const express = require("express")

//const userController = require
const usersController = require("../controller/users-controller")

const router = express.Router()
const { check } = require("express-validator")


router.post("/login", usersController.login)
router.post("/signup", [
    check("name").not().isEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 5 })
], usersController.signup)

module.exports = router