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
    
});
// validation
function isEmailExists(email) {
    if (email) {
        User.count({ _id: { '$ne': this._id }, email: email }, function (err, result) {
            if (err) {
                console.log('err',err);
                return err;
            }
            console.log('result',result);
            console.log('result',!result);
            return !result;
        })
    }
}


const User=module.exports=mongoose.model('users',userSchema)