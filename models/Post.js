const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
	title: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	date: {
		type: Date,
		default: Date.now, //or new Date(),
	},
	userName: {
		type: String,
	},
	photoUrl: {
		type: String,
	},
	reactions: {
		like: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		heart: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	comments: [
		{
			comment: String,
			created: {
				type: Date,
				default: Date.now, //or new Date(),
			},
			postedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	],
});

module.exports = mongoose.model("Posts", PostSchema);
