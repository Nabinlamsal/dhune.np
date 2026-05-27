import { ApiResponse } from "@/src/types/api";

export interface ChatbotAskPayload {
  message: string;
  session_id?: string;
}

export interface ChatbotAskResult {
  reply: string;
}

export type ChatbotAskResponse = ApiResponse<ChatbotAskResult>;
