import { XiorError } from "xior";
import { createResponse } from "@/helpers";
import apiRequest from "@/api";
import { IGetUsersResponse, IUser } from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Export types
export type { IUser };

// Stub user service for ConnectPay - placeholder for removed functionality
export const getUserData = async () => {
  return { success: true, data: null };
};

export const getUsers = async (): Promise<IGetUsersResponse> => {
  if (USE_MOCK_DATA) {
    // Mock users data for development
    const mockUsers = [
      {
        id: "69abfca6-63fb-4de3-962f-0955d8689e8f",
        name: "Vivian Frnd 3",
        email: "Vivian654@example.com",
        phone: "+2348154012262",
        avatar: null,
        created_at: "2026-01-25T18:02:42.892Z",
      },
      {
        id: "8fc13437-2032-44f3-a317-addba7b5c548",
        name: "Vivian frnd",
        email: "Vivian123@example.com",
        phone: "08154012262",
        avatar: null,
        created_at: "2026-01-22T19:27:46.382Z",
      },
    ];
    return createResponse(true, mockUsers, "Users fetched successfully", 200);
  }

  try {
    const response = await apiRequest.get("/users");
    return createResponse(
      true,
      response?.data,
      "Users fetched successfully",
      response?.status,
    );
  } catch (error) {
    let message: string, status: number | undefined;
    if (error instanceof XiorError) {
      message = error?.response?.data?.message || error.message;
      status = error?.response?.status;
    } else {
      message = (error as { message: string })?.message;
    }

    // Handle network errors specifically
    if (!status && message.includes("Network Error")) {
      message = "Unable to connect to server. Please check if the backend is running.";
    }

    return createResponse(false, [], message, status);
  }
};

export const updateOrganizationImage = async () => {
  return { success: true };
};

export const deleteOrganizationImage = async () => {
  return { success: true };
};

export const getApiKey = async () => {
  return { success: true, data: null };
};

export const changePassword = async () => {
  return { success: true };
};

export const updateOrganization = async () => {
  return { success: true };
};