import { api } from "@/src/libs/api";
import { ChatbotAskPayload, ChatbotAskResponse } from "@/src/types/chatbot";

export const askChatbot = async (
  payload: ChatbotAskPayload
): Promise<ChatbotAskResponse> => {
  return api<ChatbotAskResponse>("/support/chat", {
    method: "POST",
    data: payload,
  });
};
