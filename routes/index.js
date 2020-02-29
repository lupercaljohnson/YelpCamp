var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

//root route
router.get("/", (req, res) =>{
	
	res.render("landing");	
});

//Auth routes
//REST new
router.get("/register", (req, res)=>{
	res.render("register");
})
//REST create
router.post("/register", (req, res)=>{
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			req.flash("error", err.message);
			console.log(err);
			//return res.render("/register");
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, ()=>{
			req.flash("success", "Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds")
		});
	});
});

//Show login form 
router.get("/login",(req, res) =>{
	res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", 
	{
	 	successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),
	(req, res)=>{
});

//logout Route
router.get("/logout", (req, res) =>{
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/campgrounds");
})



module.exports = router;