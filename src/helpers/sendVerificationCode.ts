import React from "react";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hey | Verification email code",
      react: React.createElement(VerificationEmail, {
        username,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: "success to send verification email code",
    };
  } catch (error: any) {
    console.log("Error sending verification code", error);

    // If rendering failed because the renderer package is missing, fall back to a simple HTML/text email
    if (error?.message?.includes("Failed to render React component")) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Hey | Verification email code",
          html: `<p>Hello ${username},</p><p>Your verification code is <strong>${verifyCode}</strong></p>`,
          text: `Hello ${username},\nYour verification code is ${verifyCode}`,
        });

        return {
          success: true,
          message: "success to send verification email code (fallback HTML)",
        };
      } catch (fallbackError) {
        console.log("Fallback send failed", fallbackError);
      }
    }

    return { success: false, message: "Failed to send verification message" };
  }
}
