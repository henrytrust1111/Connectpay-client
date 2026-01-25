import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { IAuthData } from "../types";
import { EAppCookieType } from "@/enums";

// Utility function to get a session
export const getSession = async (options?: { [key: string]: unknown }) => {
  const sessionCookie = await getCookie(EAppCookieType.SESSION_KEY, options);
  return sessionCookie ? JSON.parse(sessionCookie) : null;
};

// Utility function to delete a session
export const deleteSession = (options?: { [key: string]: unknown }) => {
  deleteCookie(EAppCookieType.SESSION_KEY, options);
};

// Utility function to set a session
export const setSession = async (
  data: Partial<IAuthData>,
  options?: { [key: string]: unknown }
) => {
  const prevAuth: IAuthData = (await getSession(options)) || {};
  const updatedAuth = { ...prevAuth, ...data };
  try {
    const decodedToken = jwtDecode(updatedAuth.token);
    const expiry = Number(decodedToken.exp) * 1000;
    updatedAuth.expires = expiry;
    await setCookie(EAppCookieType.SESSION_KEY, JSON.stringify(updatedAuth), {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      ...options,
      maxAge: Math.floor((expiry - Date.now()) / 1000), // set the maxAge to the remaining time before expiry, // 1 day
    });
  } catch (error) {
    console.log("this is the error", error);
  }
};

// Utility function to check if a session is valid
export const isValidSession = (session?: IAuthData | null) => {
  // Same validation logic as before
  if (!session || !(session instanceof Object)) return false;
  if (!session?.token || typeof session?.token !== "string") return false;
  if (!session?.user || typeof session?.user !== "object") return false;
  const { user } = session;
  if (
    !user?.name ||
    !user?.email ||
    typeof user?.name !== "string" ||
    typeof user?.email !== "string"
  ) {
    return false;
  }
  return true;
};
