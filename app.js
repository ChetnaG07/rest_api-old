const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { checkUser } = require("./routes/verifyToken");
const PORT = process.env.PORT || 5000;

//Import Routes
const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

//Connect to DB
mongoose.connect(
	process.env.DB_CONNECT,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		writeConcern: { w: "majority", j: true, wtimeout: 1000 },
	},
	() => {
		console.log("Connected");
	}
);

//Middleware
app.use(express.json());

//Routes Middleware
app.use("/posts", postRoute);
app.use("/api/user", authRoute);
app.use("/products", productRoute);

// Routes
app.get("*", checkUser);
app.get("/", (req, res) => {
	res.send("Home");
});
app.post("/posts", checkUser);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
