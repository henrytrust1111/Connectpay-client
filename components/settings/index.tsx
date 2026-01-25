import Link from "next/link";
import { ProfileDetails } from "./profile-details";
import { DomainsTab } from "./domains-tab";
import { ApiIntegrations } from "./api-integrations";
import { EAppQueryParamsKey } from "@/enums";

interface Props {
  currentTab?: "profile" | "domains" | "api";
}

export function SettingsPage({ currentTab = "profile" }: Props) {
  const activeTab = currentTab;

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div>
        <div className="border-b border-gray-200 dark:border-dark-border">
          <div className="flex gap-5 overflow-x-auto scrollbar-hide">
            <Link
              href={{
                pathname: "",
                query: { [EAppQueryParamsKey.TAB]: "profile" },
              }}
              className={`whitespace-nowrap py-4 text-sm transition-colors relative ${
                activeTab === "profile"
                  ? "text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-gray-500 hover:text-gray-700 dark:text-dark-text"
              }`}
            >
              Profile Details
              {activeTab === "profile" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-400" />
              )}
            </Link>

            <Link
              href={{
                pathname: "",
                query: { [EAppQueryParamsKey.TAB]: "domains" },
              }}
              className={`whitespace-nowrap py-4 text-sm transition-colors relative ${
                activeTab === "domains"
                  ? "text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-gray-500 hover:text-gray-700 dark:text-dark-text"
              }`}
            >
              Domains
              {activeTab === "domains" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-400" />
              )}
            </Link>

            <Link
              href={{
                pathname: "",
                query: { [EAppQueryParamsKey.TAB]: "api" },
              }}
              className={`whitespace-nowrap py-4 text-sm transition-colors relative ${
                activeTab === "api"
                  ? "text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-gray-500 dark:text-dark-text hover:text-gray-700"
              }`}
            >
              API & Integrations
              {activeTab === "api" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-400" />
              )}
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-5">
          {activeTab === "profile" && <ProfileDetails />}
          {activeTab === "domains" && <DomainsTab />}
          {activeTab === "api" && <ApiIntegrations />}
        </div>
      </div>
    </div>
  );
}
