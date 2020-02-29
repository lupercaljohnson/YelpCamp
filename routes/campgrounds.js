var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//Index route
router.get("/", (req, res) => {
	Campground.find({}, (err, allCampgrounds)=>{
		if(err){
			console.log("Error");
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}		
	})	
});

//New route
router.get("/new", middleware.isLoggedIn, (req, res) =>{	
	res.render("campgrounds/new");	
});

//Create route
router.post("/", middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCamp = {name:name, price:price, image:image, description:desc, author:author};
	Campground.create(newCamp, (err, newitem)=>{
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
			console.log(newitem);
		}
	});	
});

//Show route
router.get("/:id", (req, res) =>{
	Campground.findById(req.params.id).populate("comments").exec( (err, foundCG) =>{
		if(err || !foundCG){
			req.flash("error", "Camground not found");
			res.redirect("back");
		}else{
			res.render("campgrounds/show", {campground: foundCG});
		}
	});
});

//Edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) =>{
	Campground.findById(req.params.id, (err, foundCG)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
				res.render("campgrounds/edit", {campground: foundCG});
	}});
});
		

//Update route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCG)=>{
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//Destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;