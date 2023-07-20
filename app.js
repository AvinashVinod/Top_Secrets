

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine","ejs");


/////////////////////////////////////////////Mongoose Section///////////////////////////////////////////////////

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret: secret, encryptedFields:['password']});

const User = new mongoose.model("User",userSchema);

////////////////////////////////////////////Routes section////////////////////////////////////////////////////


//////home route//////
app.get("/",(req,res)=>{
    res.render("home");
});


//////login route//////
app.route("/login")
.get((req,res)=>{
    res.render("login");
})
.post((req,res)=>{
  
    User.findOne({email:req.body.username})
    .then((foundUser)=>{
        if(foundUser.password === req.body.password){
            res.render("secrets");
            console.log(foundUser.password);
        }
        else{
            console.log("User has typed wrong password.");
            res.send("You have entered wrong password. Try again !!!! ");
        }
    })
    .catch((error)=>{
        res.send("You haven't registered yet try to register first.");
        console.log("User hasn't registered yet :",error);
    });

});

//////register route//////
app.route("/register")
.get((req,res)=>{
    res.render("register");
})
.post((req,res)=>{

    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save()
    .then(()=>{
        console.log("New user has been successfully registered.");
        res.render("secrets");
    })
    .catch((error)=>{
        console.error("Error in registering new user: ",error);
        res.send("Registeration Error!!! Try again.");
    })

});

//////submit route//////
app.get("/submit",(req,res)=>{
    res.render("submit");
});








app.listen(4000,()=>{
    console.log("Your server has been started in port 4000");
})