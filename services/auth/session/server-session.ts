import { cookies } from "next/headers";
import { deleteCookie } from "cookies-next";
import {
  getSession,
  isValidSession,
  setSession as setSessionDefault,
} from "./";
import type { IAuthData, IGetSession } from "../types";
import { EAppCookieType } from "@/enums";

export const getServerSession = async (): Promise<IGetSession> => {
  const authData: IAuthData | null = await getSession({ cookies });
  const isAuthenticated = isValidSession(authData);

  const logout = async () => {
    deleteCookie(EAppCookieType.SESSION_KEY, { cookies });
  };

  const setSession = async (session: IAuthData) => {
    await setSessionDefault(session, { cookies });
  };

  return {
    isAuthenticated,
    session: authData || ({} as IAuthData),
    setSession,
    logout,
  };
};
