const HttpError = require("../models/http-error")
const { validationResult } = require("express-validator")

const Product = require("../models/product")

const mongoose = require("mongoose")
const User = require("../models/user")
const product = require("../models/product")
const user = require("../models/user")

const get_productsbyId = async (req, res, next) => {
    const productId = req.params.pid
    let product
    try {
        product = await Product.findById(productId).exec()
    } catch (err) {
        const error = new HttpError("couldnt dfind product", 500)
        return next(error)
    }

    if (!product) {
        const error = new HttpError("Could not find a prodcut for the provided id", 404)
        return next(error)
    }
    res.json({ producr: product.toObject({ getter: true }) })
}

const createProduct = (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return next(new HttpError("invalid product", 422))
    }

    const { title, description, price } = req.body

    const creadteDProduct = new Product({
        title,
        description,
        image: "https://lh3.googleusercontent.com/ci/AJFM8rwqdr4P_2MEV_92ilEISXIY16I3ab9TKeyYy67BN86mP5Z5n9jWtys5zoHo5M9Xc935QBG7sQ"
        , price
    })

    creadteDProduct.save()

    res.status(201).json({ product: creadteDProduct })
}

const getallproducts = async (req, res, next) => {
    let products
    try {
        products = await Product.find({})
    } catch (err) {
        const error = new HttpError("fetching products failed, try later", 500)
        return next(error)
    }
    res.json({ products: products.map(product => product.toObject({ getters: true })) })
}

const add_product_to_basket = async (req, res, next) => {
    const userId = req.params.uid;
    const productid = req.params.pid;


    try {
        const product = await Product.findById(productid)
        // console.log(product)

        const user = await User.findById(userId)
        if (!user) {
            const error = new HttpError("user not found", 404)
            return next(error)
        }
        user.basket.push(product)
        let x = parseFloat(user.total)
        x += parseFloat(product.price)
        user.total = String(x.toFixed(0))
        await user.save()
        res.status(201).json({ total: user.total });
    } catch (err) {
        const error = new HttpError("couldn't find place", 404)
        return next(error)
    }


}

const show_basket = async (req, res, next) => {
    const userId = req.params.uid;
    const error = validationResult(req)

    try {
        const user = await User.findById(userId).populate("basket")
        //console.log(user.basket)

        const basket = user.basket

        if (basket.length === 0) {
            const error = new HttpError("empty basket", 404)
            return next(error)
        }

        res.json({ basket: basket.map(product => product.toObject({ getters: true })), total: user.total });



    } catch (err) {
        const error = new HttpError("couldn't find user", 404)
        return next(error)

    }


}

const delete_basket = async (req, res, next) => {
    const userId = req.params.uid
    const productid = req.params.pid
    let user
    try {
        user = await User.findById(userId)
        const product = await Product.findById(productid)
        if (!user) {
            const error = new HttpError("user not found", 404)
            return next(error)
        }
        const prodcutIndex = user.basket.indexOf(productid)

        if (prodcutIndex !== -1) {
            user.basket.splice(prodcutIndex, 1)
            let x = parseFloat(user.total)
            x -= parseFloat(product.price)
            user.total = String(x.toFixed(0))

            await user.save()
        }
        else {
            const error = new HttpError("no product like this exits", 404)
            return next(error)
        }


    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete product.',
            500
        );
    }
    res.status(200).json({ total: user.total });

}
exports.delete_basket = delete_basket
exports.show_basket = show_basket

exports.get_productsbyId = get_productsbyId
exports.creadteDProduct = createProduct
exports.getallproducts = getallproducts
exports.add_product_to_basket = add_product_to_basket