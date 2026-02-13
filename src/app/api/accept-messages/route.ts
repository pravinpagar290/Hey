import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user;
  if (!user || !session) {
    return Response.json(
      {
        success: false,
        message: "not authenticate d",
      },
      {
        status: 500,
      },
    );
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true },
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user info",
        },
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    console.log("failed to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept message",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user;
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticate d",
      },
      {
        status: 500,
      },
    );
  }
  try {
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        { success: false, message: "unable find the user" },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 201,
      },
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
