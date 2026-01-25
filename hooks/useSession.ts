"use client";

import { IAuthData, IGetSession } from "@/services/auth/types";
import {
  getSession,
  isValidSession,
  setSession as setSessionDefault,
} from "@/services/auth/session";
import { deleteCookie } from "cookies-next";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { EAppCookieType } from "@/enums";
import { defaultAuth } from "@/constants";

// Create a listener system for session changes
const sessionListeners = new Set<(session: IAuthData) => void>();

const notifySessionListeners = (session: IAuthData) => {
  sessionListeners.forEach((listener) => listener(session));
};

const subscribeToSessionChanges = (listener: (session: IAuthData) => void) => {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
};

export const useSession = (): IGetSession => {
  const pathname = usePathname();
  const [session, _setSession] = useState<IAuthData>(defaultAuth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    deleteCookie(EAppCookieType.SESSION_KEY);
    _setSession(defaultAuth);
    setIsAuthenticated(false);
    // Redirect is handled by middleware
    window.location.href = "/login";
  };

  const setSession = useCallback(async (newSession: IAuthData) => {
    // Update React state immediately
    _setSession(newSession);
    // Notify all other components using this hook
    notifySessionListeners(newSession);
    // Persist to cookie
    await setSessionDefault(newSession);
  }, []);

  useEffect(() => {
    (async () => {
      let isAuthenticated = false;
      const authData: IAuthData = await getSession();
      if (isValidSession(authData)) {
        isAuthenticated = true;
      }
      setIsAuthenticated(isAuthenticated);
      _setSession(authData || defaultAuth);

      // Removed redirect logic - middleware handles authentication redirects
      // This prevents race condition after login
    })();
  }, [pathname]);

  // Subscribe to session changes from other components
  useEffect(() => {
    const unsubscribe = subscribeToSessionChanges((newSession) => {
      _setSession(newSession);
    });

    return unsubscribe;
  }, []);

  return {
    isAuthenticated,
    session,
    setSession,
    logout,
  };
};
