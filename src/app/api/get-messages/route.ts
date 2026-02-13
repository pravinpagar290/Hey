import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { User } from "next-auth";

export async function GET(request:Request){
    await dbConnect()
    const session= await getServerSession(authOption)
    const _user:User= session?.user
    if(!session || !session.user){
        
    }
}