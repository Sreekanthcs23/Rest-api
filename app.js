const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/wikiDB",{ useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
	title: String,
	content: String
});

const Article = new mongoose.model("Article",articleSchema);

///////////////////////////////////Request targettig all articles///////////////////////////////////////

app.route("/articles")
	
.get(function(req,res) {
	
	Article.find({},function(err,foundItems) {
		if(!err) {
			res.send(foundItems);
		} else {
			res.send(err);
		}
	});
})

.post(function(req,res) {
	
	const newArticle = new Article({
		title: req.body.title,
		content: req.body.content
	});
	
	console.log(req.body.title);
	console.log(req.body.content);
	
	newArticle.save(function(err) {
		if(!err) {
			res.send("Saved");
		}
		else {
			res.send("Error");
		}
	});
})

.delete(function(req,res) {
	Article.deleteMany({},function(err) {
		if(!err) {
			res.send("Deleted all articles");
		}else {
			res.send(err);
		}
	});
});


///////////////////////////////////Request targettig a specific article///////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res) {
	
	const articleTitle = req.params.articleTitle;
	Article.findOne({title:articleTitle},function(err,foundArticle) {
		if(foundArticle) {
			res.send(foundArticle);
		}else {
			res.send("Article not found");
		}
	});
})

.put(function(req,res) {

	const articleTitle = req.params.articleTitle;	
	Article.replaceOne(
	{title: articleTitle},
	 req.body,
	 function(err) {
		if(!err) {
			res.send("Updated successfully");
		}else {
			res.send(err);
		}
	});
})

.patch(function(req,res) {

	const articleTitle = req.params.articleTitle;	
	Article.updateOne(
	{title: articleTitle},
	req.body,
	function(err) {
		if(!err) {
			res.send("Updated successfully");
		}else {
			res.send(err);
		}
	});
})

.delete(function(req,res) {
	
	const articleTitle = req.params.articleTitle;
	Article.deleteOne(
		{title: articleTitle},
		function(err) {
			if(!err) {
				res.send("Article deleted");
			}else {
				res.send(err);	
			}
		});
});

app.listen(3000,function() {
	console.log("Server listening on port 3000");
});












