const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registrationSchema, loginSchema } = require("../validation");

router.post("/register", async (req, res) => {
	//Validate the Data
	const { error } = registrationSchema(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Email validation
	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send("Email already exists..");

	//Hashed Password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		photoUrl: req.body.photoUrl,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (error) {
		res.status(400).send(error);
	}
});

router.post("/login", async (req, res) => {
	//Validate the Data
	const { error } = loginSchema(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Email validation
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email doesn't match..");

	//Password validation
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.status(400).send("Password doesn't match");

	//Create and assign token
	const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
	/*res.header("auth-token", token).send({Token : token });*/
	res.header("auth-token", token).send({ results: user, Token: token });
});

// Get specific User
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
