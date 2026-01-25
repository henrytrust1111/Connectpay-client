"use client";
import React from "react";
import { Button } from "@/components/common-elements/button";
import { Copy } from "lucide-react";
import { copyToClipboard } from "../data";

export const SnippetSection = () => {
  const integrationSnippet = `<script src="https://widget.eyeproctor.com/eye-widget-init.js"></script>

<script>
  async function startProctoring() {
    const widget = await LoadEyeWidget();

    await widget.init({
      apiKey: "YOUR_API_KEY",
      assessmentId: "<ASSESSMENT_ID>",
      assessmentTitle: "<ASSESSMENT_TITLE>",
      candidateId: "<CANDIDATE_ID>",
      examDuration: <EXAM_DURATION_IN_SECONDS>
    });
  }

  startProctoring();
</script>`;
  return (
    <div className="w-full max-w-[750px] space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2 dark:text-white">
          Quick Start Integration
        </h2>
        <p className="text-sm text-muted-foreground dark:text-dark-text">
          Integrate Eye by Proctorme into your platform with this quick start
          code. This example loads the widget and initializes a proctoring
          session.
        </p>
      </div>

      <div className="w-full max-w-[591px] relative border border-[#E5E5E5] rounded-[8px] dark:border-dark-border">
        <pre className="bg-[#F9FAFB] text-gray-100 rounded-lg p-4 overflow-x-auto text-sm  dark:bg-dark-background-100">
          <code>
            <span className="text-[#475569] dark:text-dark-text">
              &lt;script
            </span>{" "}
            <span className="text-[#d63384] dark:text-pink-300">src=</span>
            <span className="text-[#00C16A] dark:text-green-400">
              &quot;https://widget.eyeproctor.com/eye-widget-init.js&quot;&gt;
            </span>
            <span className="text-[#475569] dark:text-dark-text">
              &lt;/script&gt;
            </span>
            {"\n"}
            {"\n"}
            <span className="text-[#475569] dark:text-dark-text">
              &lt;script&gt;
            </span>
            {"\n"}
            {"  "}
            <span className="text-[#005cc5] dark:text-blue-400">
              async
            </span>{" "}
            <span className="text-[#6f42c1] dark:text-purple-400">
              function
            </span>{" "}
            <span className="text-[#24292e] dark:text-white">
              startProctoring
            </span>
            ()
            {"\n"}
            {"  "}
            <span className="text-[#24292e] dark:text-white">{"{"}</span>
            {"\n"}
            {"    "}
            <span className="text-[#d73a49] dark:text-red-400">const</span>{" "}
            <span className="text-[#24292e] dark:text-white">widget</span>{" "}
            <span className="text-[#d73a49] dark:text-red-400">=</span>{" "}
            <span className="text-[#d73a49] dark:text-red-400">await</span>{" "}
            <span className="text-[#6f42c1] dark:text-purple-400">
              LoadEyeWidget
            </span>
            <span className="text-[#24292e] dark:text-white">()</span>;{"\n"}
            {"\n"}
            {"    "}
            <span className="text-[#d73a49] dark:text-red-400">await</span>{" "}
            <span className="text-[#24292e] dark:text-white">widget</span>.
            <span className="text-[#6f42c1] dark:text-purple-400">init</span>(
            <span className="text-[#24292e] dark:text-white">{"{"}</span>
            {"\n"}
            {"      "}
            <span className="text-[#24292e] dark:text-white">apiKey</span>
            <span className="text-[#d73a49] dark:text-red-400">:</span>{" "}
            <span className="text-[#032f62] dark:text-blue-300">
              &quot;YOUR_API_KEY&quot;
            </span>
            ,{"\n"}
            {"      "}
            <span className="text-[#24292e] dark:text-white">assessmentId</span>
            <span className="text-[#d73a49] dark:text-red-400">:</span>{" "}
            <span className="text-[#032f62] dark:text-blue-300">
              &quot;&lt;ASSESSMENT_ID&gt;&quot;
            </span>
            ,{"\n"}
            {"      "}
            <span className="text-[#24292e] dark:text-white">
              assessmentTitle
            </span>
            <span className="text-[#d73a49] dark:text-red-400">:</span>{" "}
            <span className="text-[#032f62] dark:text-blue-300">
              &quot;&lt;ASSESSMENT_TITLE&gt;&quot;
            </span>
            ,{"\n"}
            {"      "}
            <span className="text-[#24292e] dark:text-white">candidateId</span>
            <span className="text-[#d73a49] dark:text-red-400">:</span>{" "}
            <span className="text-[#032f62] dark:text-blue-300">
              &quot;&lt;CANDIDATE_ID&gt;&quot;
            </span>
            ,{"\n"}
            {"      "}
            <span className="text-[#24292e] dark:text-white">examDuration</span>
            <span className="text-[#d73a49] dark:text-red-400">:</span>{" "}
            <span className="text-[#005cc5] dark:text-blue-400">
              &lt;EXAM_DURATION_IN_SECONDS&gt;
            </span>
            {"\n"}
            {"    "}
            <span className="text-[#24292e] dark:text-white">{"}"}</span>
            <span className="text-[#24292e] dark:text-white">)</span>;{"\n"}
            {"  "}
            <span className="text-[#24292e] dark:text-white">{"}"}</span>
            {"\n"}
            {"\n"}
            {"  "}
            <span className="text-[#24292e] dark:text-white">
              startProctoring
            </span>
            <span className="text-[#24292e] dark:text-white">()</span>;{"\n"}
            <span className="text-[#475569] dark:text-dark-text">
              &lt;/script&gt;
            </span>
          </code>
        </pre>
        <button
          onClick={() =>
            copyToClipboard(integrationSnippet, "Quick start code")
          }
          className="absolute top-3 right-3 p-2 rounded-md transition-colors cursor-pointer"
        >
          <Copy className="size-4 text-[#71717A] dark:text-white" />
        </button>
      </div>

      <Button
        variant={"dark"}
        onClick={() => copyToClipboard(integrationSnippet, "Quick start code")}
        className="w-full sm:w-auto h-[52px] shawdow-xs dark:bg-primary-600 dark:border-primary-500"
      >
        Copy to clipboard
      </Button>
    </div>
  );
};
