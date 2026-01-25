// Calls service functions
import apiRequest from "@/api";
import { createResponse } from "@/helpers";
import { XiorError } from "xior";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const startCall = async (receiverId: string) => {
  if (USE_MOCK_DATA) {
    return createResponse(true, {
      callId: 'call_' + Date.now(),
      status: 'ringing',
      receiverId,
      startTime: new Date().toISOString()
    }, "Call started successfully", 200);
  }

  try {
    const response = await apiRequest.post("/call/start", { receiverId });
    return createResponse(true, response?.data, "Call started successfully", response?.status);
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

export const endCall = async (callId: string) => {
  if (USE_MOCK_DATA) {
    return createResponse(true, {
      callId,
      status: 'ended',
      endTime: new Date().toISOString()
    }, "Call ended successfully", 200);
  }

  try {
    const response = await apiRequest.post("/call/end", { callId });
    return createResponse(true, response?.data, "Call ended successfully", response?.status);
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