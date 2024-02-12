const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

const jwt = require("jsonwebtoken");

const { verifyUser, checkUser } = require("./verifyToken");

// Getting all posts
router.get("/", verifyUser, async (req, res) => {
	/*res.send(req.user)*/
	try {
		const posts = await Post.find().populate(
			"comments.postedBy",
			"_id name photoUrl"
		);

		res.json(posts);
	} catch (err) {
		res.json({ message: err });
	}
});

// Add reactions
router.put("/reactions", async (req, res) => {
	let reaction = req.body.reactionName;
	let userId = req.body.userId;

	try {
		Post.findOneAndUpdate(
			{ _id: req.body.postId },
			/* 	{ $pull: { "reactions.$": userId } }, */
			{ $addToSet: { [`reactions.${reaction}`]: userId } },
			{ new: true, upsert: true }
		)
			.populate({
				path: "reactions",
				populate: {
					path: reaction,
					select: "_id name",
				},
			})
			.exec(function (err, result) {
				if (err) return console.log(err);
				return res.json(result);
			});

		/* console.log("postNew", post.reactions[reaction]); */
	} catch (err) {
		console.log(err);
	}
});

// Remove reactions
router.put("/removeReactions", async (req, res) => {
	let reaction = req.body.reactionName;
	let userId = req.body.userId;

	try {
		Post.findOneAndUpdate(
			{ _id: req.body.postId },
			{ $pull: { [`reactions.${reaction}`]: userId } },
			{ new: true }
		).exec(function (err, result) {
			if (err) return console.log(err);
			return res.json(result);
		});

		/* console.log("postNew", post.reactions[reaction]); */
	} catch (err) {
		console.log(err);
	}
});

// Add Comments
router.put("/comment", async (req, res) => {
	let comment = {
		comment: req.body.comment,
		postedBy: req.body.userId,
	};

	try {
		Post.findByIdAndUpdate(
			{ _id: req.body.postId },
			{ $push: { comments: comment } },
			{ new: true }
		)
			.populate("comments.postedBy", "_id name photoUrl")

			.exec((err, result) => {
				if (err) {
					return res.json({
						error: err,
					});
				} else {
					return res.json(result);
				}
			});
	} catch (err) {
		console.log(err);
	}
});

// Remove Comments
router.put("/removeComment", async (req, res) => {
	let comment = req.body.commentId;

	try {
		Post.findByIdAndUpdate(
			{ _id: req.body.postId },
			{ $pull: { comments: { _id: comment } } },
			{ new: true }
		).exec((err, result) => {
			if (err) {
				return res.json({
					error: err,
				});
			} else {
				return res.json(result);
			}
		});
	} catch (err) {
		console.log(err);
	}
});

// Save post
router.post("/", async (req, res) => {
	const post = new Post({
		title: req.body.title,
		description: req.body.description,
		userName: req.body.userName,
		photoUrl: req.body.photoUrl,
	});
	/* const token = req.header("auth-token"); */
	try {
		const savedPost = await post.save();
		/* 	
		To decode and get user from auth-token
		const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
		var userId = decoded._id;
		const userr = await User.findOne({ _id: userId });
		 res.send({ savedPost, userName: userr.name });  */

		res.send(savedPost);
	} catch (err) {
		res.json({ message: err });
	}
});

// Get specific post
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.json(post);
	} catch (err) {
		res.json({ message: err });
	}
});

// Remove post
router.delete("/:id", async (req, res) => {
	try {
		const removePost = await Post.remove({ _id: req.params.id });
		res.json(removePost);
	} catch (err) {
		res.json({ message: err });
	}
});

// Update post
router.patch("/:id", async (req, res) => {
	try {
		const updatedPost = await Post.updateOne(
			{ _id: req.params.id },
			{ $set: { title: req.body.title, description: req.body.description } }
		);
		res.json(updatedPost);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
