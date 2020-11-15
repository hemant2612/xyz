const mongoose=require('mongoose');
// Page schema
var cardSchema=mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    slug:{
        type:String
    },
    content:{
        type:String,
        required:true
    },
    sorting:{
        type:Number
    }
})
var Page=module.exports=mongoose.model('cards',cardSchema);
