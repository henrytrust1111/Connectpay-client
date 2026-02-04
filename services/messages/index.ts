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

// Edit message (PATCH /api/chats/message/:id)
export const editMessage = async (id: string, message: string) => {
  try {
    const response = await apiRequest.patch(`/chats/message/${id}`, { message });
    return createResponse(true, response?.data, "Message edited", response?.status);
  } catch (error) {
    let messageText: string, status: number | undefined;
    if (error instanceof XiorError) {
      messageText = error?.response?.data?.message || error.message;
      status = error?.response?.status;
    } else {
      messageText = (error as { message: string })?.message;
    }
    return createResponse(false, null, messageText, status);
  }
};

// Delete message (DELETE /api/chats/message/:id?type=me|everyone)
export const deleteMessage = async (id: string, type: "me" | "everyone" = "me") => {
  try {
    const response = await apiRequest.delete(`/chats/message/${id}?type=${type}`);
    return createResponse(true, response?.data, "Message deleted", response?.status);
  } catch (error) {
    let messageText: string, status: number | undefined;
    if (error instanceof XiorError) {
      messageText = error?.response?.data?.message || error.message;
      status = error?.response?.status;
    } else {
      messageText = (error as { message: string })?.message;
    }
    return createResponse(false, null, messageText, status);
  }
};