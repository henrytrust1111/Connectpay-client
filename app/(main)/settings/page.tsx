export const dynamic = "force-dynamic";

import { SettingsPage } from "@/components/settings";
import { EAppQueryParamsKey } from "@/enums";
import { MobileTitle } from "@/components/mobile-title";

export default async function Settings({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const currentTab =
    (await searchParams)?.[EAppQueryParamsKey.TAB] ?? "profile";

  return (
    <div className="flex flex-col gap-5 pb-22 sm:pb-10 h-full">
      <MobileTitle title="Settings" />
      <div className="px-5 space-y-5 flex-1">
        <SettingsPage
          currentTab={currentTab as "profile" | "domains" | "api"}
        />
      </div>
    </div>
  );
}
