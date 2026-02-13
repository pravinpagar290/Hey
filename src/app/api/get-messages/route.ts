import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "user not authenticated",
      },
      {
        status: 401,
      },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } }, //give the user in array
      { $unwind: "$message" }, //unfold the array _id,user,and message
      { $sort: { "$message.createdAt": -1 } }, //sort the message by created date
      { $group: { _id: "$_id", message: { $push: "$message" } } }, //group the message by id and the message
    ]);
    if (!user || !userId) {
      return Response.json(
        {
          success: false,
          message: "not authenticated",
        },
        { status: 401 },
      );
    }
    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      { status: 401 },
    );
  } catch (error) {
    console.log("failed to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "error in getting accepting message status",
      },
      {
        status: 500,
      },
    );
  }
}
