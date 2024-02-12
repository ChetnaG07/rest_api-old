const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

//get all products
router.get("/", async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		res.json({ message: error });
	}
});

// add product
router.post("/add-product", async (req, res) => {
	const product = new Product({
		name: req.body.name,
		description: req.body.description,
		thumnail: req.body.thumnail,
		images: req.body.images,
		price: req.body.price,
		category: req.body.category,
	});
	try {
		const savedProduct = await product.save();
		res.json(savedProduct);
	} catch (error) {
		res.json({ message: error });
	}
});

// get a single product
router.get("/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		res.json(product);
	} catch (error) {
		res.json({ message: error });
	}
});

module.exports = router;
