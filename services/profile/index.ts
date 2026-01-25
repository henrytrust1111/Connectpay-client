// Profile service functions
import apiRequest from "@/api";
import { createResponse } from "@/helpers";
import { XiorError } from "xior";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const getProfile = async () => {
  if (USE_MOCK_DATA) {
    return createResponse(true, {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      avatar: null
    }, "Profile fetched successfully", 200);
  }

  try {
    const response = await apiRequest.get("/profile");
    return createResponse(true, response?.data, "Profile fetched successfully", response?.status);
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

export const updateProfile = async (data: { name: string; phone: string; avatar?: string }) => {
  if (USE_MOCK_DATA) {
    return createResponse(true, {
      id: 1,
      name: data.name,
      email: 'test@example.com',
      phone: data.phone,
      avatar: data.avatar
    }, "Profile updated successfully", 200);
  }

  try {
    const response = await apiRequest.put("/profile", data);
    return createResponse(true, response?.data, "Profile updated successfully", response?.status);
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