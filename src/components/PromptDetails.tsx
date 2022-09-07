import {
  SparklesIcon,
  ArrowPathRoundedSquareIcon,
  Square2StackIcon,
  ArrowsUpDownIcon,
  ArrowsRightLeftIcon,
  FingerPrintIcon,
  ScaleIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import React, { cloneElement, FunctionComponent, HTMLProps, ReactElement } from "react";
import { useAppDispatch } from "src/hooks";
import { paramPrompt, PROMPT_REGEXES } from "src/store";
import { PromptConfig } from "src/types";
import { classNames, HTMLStyleProps } from "src/utils";
import { Button } from "./Button";

export type PromptDetailsProps = HTMLStyleProps<HTMLDivElement> & {
  config: PromptConfig;
};

export const PromptDetails: FunctionComponent<PromptDetailsProps> = ({ className, config }) => {
  return (
    <div className={classNames("relative pt-4 px-4", className)}>
      <PromptTag
        icon={<Square2StackIcon />}
        label="iterations"
        value={config.iterations}
        title="Number of samplings to perform (slower, but will provide seeds for individual images)"
      />
      <PromptTag
        icon={<FingerPrintIcon />}
        label="seed"
        value={config.seed}
        title="Image seed; a +ve integer, or use -1 for the previous seed, -2 for the one before that, etc"
      />
      <PromptTag icon={<ArrowPathRoundedSquareIcon />} label="steps" value={config.steps} title="Number of steps" />
      <PromptTag
        icon={<ArrowsRightLeftIcon />}
        label="width"
        value={config.width}
        title="Image width, multiple of 64"
      />
      <PromptTag
        icon={<ArrowsUpDownIcon />}
        label="height"
        value={config.height}
        title="Image height, multiple of 64"
      />
      <PromptTag
        icon={<ScaleIcon />}
        label="cfgscale"
        value={config.cfgscale}
        title={'Classifier free guidance (CFG) scale - higher numbers cause generator to "try" harder.'}
      />
      <PromptTag
        icon={<SwatchIcon />}
        label="sampler"
        value={config.sampler}
        title={
          "Switch to a different sampler. Supported samplers: ddim, k_dpm_2_a, k_dpm_2, k_euler_a, k_euler, k_heun, k_lms, plms."
        }
      />
      <PromptTag
        icon={<SwatchIcon />}
        label="strength"
        value={config.strength}
        title={"Strength for noising/unnoising. 0.0 preserves image exactly, 1.0 replaces it completely"}
      />
      {/* <pre className="flex">
        <code className="w-10 text-xs">{JSON.stringify(config, null, 2)}</code>
      </pre> */}
    </div>
  );
};

export type PromptTagProps = HTMLStyleProps<HTMLDivElement> & {
  label: keyof typeof PROMPT_REGEXES;
  value?: string | number;
  icon?: ReactElement;
};

export const PromptTag: FunctionComponent<PromptTagProps> = ({ className, icon, label, value, title }) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      title={title}
      size="xs"
      variant="dark"
      onClick={() => dispatch(paramPrompt([label, value]))}
      className={classNames(" py-1 px-2 mr-1 inline-flex", className)}
    >
      {icon ? cloneElement(icon, { className: "w-4 h-4", ariaHidden: true }) : null}
      <span className="text-xs font-medium px-1">{value}</span>
      <span style={{ fontSize: 12 }}>{label}</span>
    </Button>
  );
};