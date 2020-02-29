var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, (req, res) =>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground:campground});
		}
	});
	
});

//Comments create
router.post("/", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err); 
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});
});

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
	
	Campground.findById(req.params.id, (err, foundCG)=>{
		if(err || !foundCG){
			req.flash("error", "Campground not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
		res.redirect("back");
		}else{
		req.flash("success", "Comment edited");
		res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
		}
		});
	});
});
	
		
		
	

//Comment Update router
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment updated");
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

//Comment Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router;