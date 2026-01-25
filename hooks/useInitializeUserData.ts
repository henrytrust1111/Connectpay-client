"use client";

import { useEffect } from "react";
import { useSession } from "./useSession";
import { getProfile } from "@/services/profile";

export const useInitializeUserData = () => {
  const { session, setSession } = useSession();

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        if (!session?.token) return;

        const resp = await getProfile();
        if (resp.success && resp.data) {
          // Update session with latest profile data
          setSession({
            ...session,
            user: {
              ...session.user,
              ...resp.data,
            },
          });
        }
      } catch (error) {
        console.error("Failed to initialize user data:", error);
      }
    };

    initializeUserData();
  }, [session?.token, setSession]);
};
