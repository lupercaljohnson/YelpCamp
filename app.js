var express 			= require ("express"),
 	bodyParser 			= require("body-parser"),
 	mongoose 			= require("mongoose"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	User				= require("./models/user"),
 	Campground 			= require("./models/campground"),
 	Comment 			= require("./models/comment"),
 	seedDB 				= require("./seeds"),
 	methodOverride		= require("method-override"),
	flash				= require("connect-flash"),
	app					= express();


//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	authRoutes 			= require("./routes/index");
	

//seedDB();

//Database link removed
mongoose.connect("/*Here be link to database*/" {
	useNewUrlParser: true, 
	useCreateIndex: true,
	useUnifiedTopology: true 
}).then(()=>{
	console.log("connected to DB!");
}).catch(err =>{
	console.log("ERROR", err.message);	
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); //have to be before passport config
//Passport config
app.use(require("express-session")({
	secret: "Peeta on iso kissa",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//Heroku listen
//app.listen(process.env.PORT, process.env.IP);


// goormide listen 

app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});

