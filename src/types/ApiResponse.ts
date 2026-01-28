import { Message } from "@/app/model/User.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccesptingMessage?: boolean;
  messages?: Array<Message>;
}
