//jshint esversion:6
require('dotenv').config();//Alwase put env config at the top.
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const app=express();

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({

    email:String,
    password:String

});

const secret="Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret:process.env.SECRET , encryptedFields:["password"] });//encrypting the password field.

const User=new mongoose.model('User',userSchema);

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

    res.render("home");

});

app.get("/login",function(req,res){

    res.render("login");

});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).then(function(foundUser){
        if(foundUser)
        {
            if(foundUser.password===password)
            {
                res.render("secrets");
            }
        }
    })
})

app.get("/register",function(req,res){

    res.render("register");

});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save().then(function(result){
        console.log("document saved",result);
        res.render("secrets");
    }).catch(function(err){
        console.log(err);
    });

})





app.listen(3000,function(){

    console.log("Server is runnning on port 3000");

})