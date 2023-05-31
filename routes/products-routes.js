const express = require("express")
const { check } = require("express-validator")

//product controller
const producrController = require("../controller/product-controller")
const check_auth = require("../middleware/check-auth")


const router = express.Router()

//get all products
router.get("/", producrController.getallproducts)
//create product from postman
router.post("/create", [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("price").not().isEmpty()

], producrController.creadteDProduct)
//get product by id
router.get("/:pid", producrController.get_productsbyId)



//add product to user basket
router.post("/user/:uid/basket/:pid", producrController.add_product_to_basket)

//show basket 
router.get("/user/:uid", producrController.show_basket)

//delete user product
router.delete("/user/:uid/basket/:pid", producrController.delete_basket)






module.exports = router