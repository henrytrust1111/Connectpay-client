import { EAppRoutes } from "@/enums";

export const getTitleAndDetails = (pathname: string) => {
  let title = "Overview";
  let details =
    "A quick summary of your organization's proctoring activity and financial performance.";
  if (pathname.startsWith(EAppRoutes.SETTINGS)) {
    title = "Settings";
    details = "";
  }
  return { title, details };
};
