import React, { FunctionComponent, HTMLProps } from "react";
import { classNames } from "src/utils";

type ProgressStatus = "idle" | "pending" | "loading" | "succeeded" | "failed" | "canceled";

export type PromptProgressProps = HTMLProps<HTMLDivElement> & {
  progress: number;
  status: ProgressStatus;
};

const statusClassNames: Record<ProgressStatus, [string, string]> = {
  idle: ["bg-gray-200", "bg-gray-600"],
  pending: ["bg-indigo-200", "bg-indigo-600"],
  loading: ["bg-blue-200", "bg-blue-600"],
  succeeded: ["bg-green-200", "bg-green-300"],
  failed: ["bg-red-200", "bg-red-300"],
  canceled: ["bg-orange-200", "bg-orange-300"],
};

export const PromptProgress: FunctionComponent<PromptProgressProps> = ({ progress, status, ...otherProps }) => {
  const [outerClassName, innerClassName] = statusClassNames[status];
  return (
    <div className={classNames("w-auto h-1 mx-1 rounded-b-full", outerClassName)}>
      <div
        className={classNames("w-[1%] h-1 origin-left bg-blue-600 rounded-b-full", innerClassName)}
        style={{
          width: `${progress}%`,
          transition: status === "loading" ? "width 1s ease" : undefined,
        }}
      />
    </div>
  );
};

/*
<div class="square">
    <div class="left"></div>
    <div class="center"></div>
    <div class="right"></div>
</div>
*/
