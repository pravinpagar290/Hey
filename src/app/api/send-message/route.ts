import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { Message } from "@/app/model/User.model";
import { success } from "zod";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        },
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "user is not accepting the messages" },
        { status: 403 },
      );
    }
    const newMessage= {content,createdAt:new Date()}
    user.messages.push(newMessage as Message)
    await user.save()
    return Response.json(
        {
            success:true,
            message:'message sent to user'
        },{status:201}
    )
  } catch (error) 
  {
    console.log('unexpected error');
    
    return Response.json(
        { success: false, message: "failed to send message" },
        { status: 500 },
      );
  }
}
