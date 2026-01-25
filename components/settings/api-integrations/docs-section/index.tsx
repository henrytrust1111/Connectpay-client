import React from "react";

export const DocsSection = () => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold dark:text-white">
        Developer Documentation
      </h2>
      <p className="text-sm text-muted-foreground dark:text-dark-text">
        Explore Eye&apos;s API reference for integrating assessment proctoring,
        flag retrieval, and billing endpoints.
      </p>
      <a
        href="https://docs.eyeproctor.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-blue underline text-sm inline-block"
      >
        https://docs.eyeproctor.com
      </a>
    </div>
  );
};
