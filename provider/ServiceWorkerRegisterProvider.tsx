"use client";

import { useEffect } from "react";

export function ServiceWorkerRegisterProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}