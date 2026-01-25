// Messages service functions
import apiRequest from "@/api";
import { createResponse } from "@/helpers";
import { XiorError } from "xior";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const getChats = async (userId: string) => {
  if (USE_MOCK_DATA) {
    return createResponse(true, [
      {
        id: 1,
        participant: 'John Doe',
        lastMessage: 'Hey, how are you?',
        timestamp: new Date().toISOString(),
        unreadCount: 2
      },
      {
        id: 2,
        participant: 'Jane Smith',
        lastMessage: 'Thanks for the payment!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0
      }
    ], "Chats fetched successfully", 200);
  }

  try {
    const response = await apiRequest.get(`/chats/${userId}`);
    return createResponse(true, response?.data, "Chats fetched successfully", response?.status);
  } catch (error) {
    let message: string, status: number | undefined;
    if (error instanceof XiorError) {
      message = error?.response?.data?.message || error.message;
      status = error?.response?.status;
    } else {
      message = (error as { message: string })?.message;
    }
    return createResponse(false, null, message, status);
  }
};