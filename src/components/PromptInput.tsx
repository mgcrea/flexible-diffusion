import React, { FunctionComponent, HTMLProps, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { usePromptMutation } from "src/services/dreamApi";
import { promptOutput } from "src/store";
import { PromptOptions } from "src/types";
import { Input, InputProps } from "./Input";

const PLACEHOLDER = "a photograph of an astronaut riding a horse";
const STEPS_REGEX = /(?:\-s|\-\-steps)([\d]+)/;
const SEED_REGEX = /(?:\-S|\-\-seed)([\d]+)/;
const ITERATIONS_REGEX = /(?:\-n|\-\-iterations)([\d]+)/;

const parseNumberFromRegex = (
  prompt: string,
  regex: RegExp,
  defaultValue?: number
): number | undefined => {
  const matches = prompt.match(regex);
  return matches ? parseInt(matches[1], 10) : defaultValue;
};

const parsePrompt = (prompt: string): PromptOptions => {
  const seed = parseNumberFromRegex(prompt, SEED_REGEX, -1);
  const iterations = parseNumberFromRegex(prompt, ITERATIONS_REGEX, 1);
  const steps = parseNumberFromRegex(prompt, STEPS_REGEX, 5);
  return { prompt, seed, iterations, steps };
};

export type PromptInputProps = HTMLProps<HTMLDivElement>;

export const PromptInput: FunctionComponent<PromptInputProps> = ({
  ...otherProps
}) => {
  const [value, setValue] = useState(PLACEHOLDER);
  const dispatch = useAppDispatch();
  const [prompt, result] = usePromptMutation();
  const { status, currentStep, totalSteps } = useAppSelector(
    (state) => state.outputs
  );
  const progress = currentStep && totalSteps ? currentStep / totalSteps : 0;

  const onKeyDown: InputProps["onKeyDown"] = async (evt) => {
    const { key } = evt;
    if (key === "Enter") {
      evt.preventDefault();
      // const res = await tryFetch(value);
      const options = parsePrompt(value);
      const res = await dispatch(promptOutput(options)).unwrap();
      console.log({ res });
      // const res = await prompt({ prompt: value }).unwrap();
      // console.log({ res });
    }
  };
  return (
    <div {...otherProps}>
      <Input
        value={value}
        label="Prompt what you want to render"
        placeholder={PLACEHOLDER}
        onChange={(evt) => {
          setValue((evt.target as HTMLInputElement).value);
        }}
        onKeyDown={onKeyDown}
      />
      <div>{status}</div>
      <div>{(progress * 100).toFixed(2)}%</div>
    </div>
  );
};

/*
Example: dream> a fantastic alien landscape -W1024 -H960 -s100 -n12

positional arguments:
  prompt

optional arguments:
  -h, --help            show this help message and exit
  -s STEPS, --steps STEPS
                        Number of steps
  -S SEED, --seed SEED  Image seed; a +ve integer, or use -1 for the previous seed, -2 for the one before that, etc
  -n ITERATIONS, --iterations ITERATIONS
                        Number of samplings to perform (slower, but will provide seeds for individual images)
  -W WIDTH, --width WIDTH
                        Image width, multiple of 64
  -H HEIGHT, --height HEIGHT
                        Image height, multiple of 64
  -C CFG_SCALE, --cfg_scale CFG_SCALE
                        Classifier free guidance (CFG) scale - higher numbers cause generator to "try" harder.
  -g, --grid            generate a grid
  --outdir OUTDIR, -o OUTDIR
                        Directory to save generated images and a log of prompts and seeds
  -i, --individual      Generate individual files (default)
  -I INIT_IMG, --init_img INIT_IMG
                        Path to input image for img2img mode (supersedes width and height)
  -T, -fit, --fit       If specified, will resize the input image to fit within the dimensions of width x height (512x512 default)
  -f STRENGTH, --strength STRENGTH
                        Strength for noising/unnoising. 0.0 preserves image exactly, 1.0 replaces it completely
  -G GFPGAN_STRENGTH, --gfpgan_strength GFPGAN_STRENGTH
                        The strength at which to apply the GFPGAN model to the result, in order to improve faces.
  -U UPSCALE [UPSCALE ...], --upscale UPSCALE [UPSCALE ...]
                        Scale factor (2, 4) for upscaling followed by upscaling strength (0-1.0). If strength not specified, defaults to 0.75
  -save_orig, --save_original
                        Save original. Use it when upscaling to save both versions.
  -x, --skip_normalize  Skip subprompt weight normalization
  -A SAMPLER_NAME, -m SAMPLER_NAME, --sampler SAMPLER_NAME
                        Switch to a different sampler. Supported samplers: ddim, k_dpm_2_a, k_dpm_2, k_euler_a, k_euler, k_heun, k_lms, plms
  -t, --log_tokenization
                        shows how the prompt is split into tokens
  -v VARIATION_AMOUNT, --variation_amount VARIATION_AMOUNT
                        If > 0, generates variations on the initial seed instead of random seeds per iteration. Must be between 0 and 1. Higher values will be more different.
  -V WITH_VARIATIONS, --with_variations WITH_VARIATIONS
                        list of variations to apply, in the format `seed:weight,seed:weight,...
                        */
