import dbConnect from "@/lib/dbConnect";
import User from "@/app/model/User.model";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 },
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpiry && isCodeValid) {
      ((user.isVerified = true), await user.save());

      return Response.json(
        {
          success: true,
          message: "Account successfully verified",
        },
        {
          status: 200,
        },
      );
    } else if (!isCodeNotExpiry) {
      return Response.json(
        {
          success: false,
          message: "code is expired",
        },
        {
          status: 500,
        },
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "invalid code",
        },
        {
          status: 500,
        },
      );
    }
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      },
    );
  }
}
