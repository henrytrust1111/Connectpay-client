import xior from "xior";
import { IAuthData } from "@/services/auth/types";
import { getSession } from "@/services/auth/session";
import { EAppQueryParamsKey } from "@/enums";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log("The Request URL", baseURL)

const apiRequest = xior.create({
  baseURL,
});

apiRequest.interceptors.request.use(async (config) => {
  config.headers = config.headers ?? {};
  // SERVER-SIDE
  if (typeof window === "undefined") {
    // Dynamic imports for server-only modules
    const { cookies } = await import("next/headers");
    const { headers } = await import("next/headers");
    const { redirect } = await import("next/navigation");
    const session: IAuthData = (await getSession({ cookies })) || {};

    if (session?.token) {
      const isExpired = Date.now() > session.expires;
      // const isExpired = true

      if (isExpired) {
        const headersList = await headers();
        const header_url = headersList.get("x-url") || "";
        redirect(`/login?${EAppQueryParamsKey.REDIRECT_URL}=${header_url}`);
      }

      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }
  // CLIENT-SIDE
  else {
    const session: IAuthData | null = await getSession();

    if (session?.token) {
      const isExpired = Date.now() > session.expires;
      // const isExpired = true;

      if (isExpired) {
        // Client-side redirect using window.location
        window.location.href = `/login?${EAppQueryParamsKey.REDIRECT_URL}=${window.location.pathname}`;
        throw new Error("Session expired"); // Stop the request
      }

      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }
  return config;
});

export default apiRequest;
