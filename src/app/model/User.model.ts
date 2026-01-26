import { create } from "domain";
import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    userName:string;
    password:string;
    email:string;
    isVerified:boolean;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    messages:Message[];
    createdAt:Date
}

const UserSchema:Schema<User>=new Schema({
    userName:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Email is required'],
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'please use a valid email address']
    },
    isVerified:{
        type:Boolean,
        defualt:false
    },
    verifyCode:{
        type:String,
        required:[true,'verify code is required']
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verify code expiry is required']
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:{
        type:[MessageSchema],
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

// export default mongoose.models.User || mongoose.model('User',UserSchema)
const UserModel= (mongoose.models.User as mongoose.Model<User>) || mongoose.model('User',UserSchema)

export default UserModel