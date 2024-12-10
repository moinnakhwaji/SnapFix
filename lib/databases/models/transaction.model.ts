import {Schema,model,models} from "mongoose"


const TransactionSchema = new Schema({
    createdAT:{
        type:Date,
        default:Date.now
    },
    stripeId:{
        unique:true,
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    credits:{
        type:Number,

    },
    plan:{
        type:String,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'

    }

})