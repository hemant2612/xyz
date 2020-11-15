const mongoose=require('mongoose');
const validator=require('validator');
// const bcrypt = require('bcryptjs');
// const jwt=require('jsonwebtoken');
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid.')
            }
        }
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('cannot caontain password')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('age must be a positive number')
            }
        }
    },
    admin:{
        type:Number
    }
    
})
const User=module.exports=mongoose.model('users',userSchema)