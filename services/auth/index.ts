import { XiorError } from "xior";
import { createResponse } from "@/helpers";
import apiRequest from "@/api";
import { IForgotPasswordResponse } from "./types";
import { IResetPasswordResponse } from "./types";
import { IVerifyUserResponse } from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const authUserLogin = async (email: string, password: string) => {
  if (USE_MOCK_DATA) {
    // Mock login for development
    if (email === "test@example.com" && password === "password") {
      // Create a mock JWT with valid structure (header.payload.signature)
      // Payload expires in 24 hours
      const mockPayload = {
        userId: "1",
        email: "test@example.com",
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
      };
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        btoa(JSON.stringify(mockPayload)) +
        ".mock-signature";

      return createResponse(
        true,
        {
          userId: "1",
          token: mockToken,
          name: "Test User",
          email: "test@example.com",
          phone: "+1234567890",
        },
        "Login successful",
        200,
      );
    } else {
      return createResponse(false, null, "Invalid credentials", 401);
    }
  }

  // implement login logic here
  try {
    const response = await apiRequest.post("/login", { email, password });
    return createResponse(
      true,
      response?.data,
      "Login successful",
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
      message =
        "Unable to connect to server. Please check if the backend is running.";
    }

    return createResponse(false, null, message, status);
  }
};

export const authUserSignup = async (
  name: string,
  email: string,
  phone: string,
  password: string,
) => {
  try {
    const response = await apiRequest.post("/signup", {
      name,
      email,
      phone,
      password,
    });
    return createResponse(
      true,
      response?.data,
      "Signup successful",
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
    return createResponse(false, null, message, status);
  }
};

export const UserForgotPassword = async (email: string) => {
  try {
    const response = await apiRequest.post<IForgotPasswordResponse>(
      "/organisations/request-reset-password",
      { email },
    );
    console.log("forgot password", response);

    return createResponse(
      true,
      response.data,
      response.data.message,
      response.status,
    );
  } catch (error) {
    console.log("request password reset", error);

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

export const UserResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await apiRequest.post<IResetPasswordResponse>(
      "/organisations/reset-password",
      { token, newPassword },
    );
    console.log("reset password", response);

    return createResponse(
      true,
      response.data,
      response.data.message,
      response.status,
    );
  } catch (error) {
    console.log(error);

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

export const verifySignUpToken = async (token: string) => {
  try {
    const response = await apiRequest.get<IVerifyUserResponse>(
      `auth/organisation/verify/${token}`,
    );
    // console.log("verify signup token", response);

    return createResponse(
      true,
      response.data,
      response.data.message,
      response.status,
    );
  } catch (error) {
    console.log(error);

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
