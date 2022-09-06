import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../root";
import { PromptConfig, PromptOptions } from "src/types";
import { parseNumberFromRegex, replaceAll, replaceOrAppend } from "src/utils";

const DEFAULT_VALUE = "a photograph of an astronaut riding a horse";
const STEPS_REGEX = /(?:\s\-s|\-\-steps)[\s]*([\d]+)/;
const SEED_REGEX = /(?:\s\-S|\-\-seed)[\s]*([\d]+)/;
const ITERATIONS_REGEX = /(?:\s\-n|\-\-iterations)[\s]*([\d]+)/;
const WIDTH_REGEX = /(?:\s\-W|\-\-width)[\s]*([\d]+)/;
const HEIGHT_REGEX = /(?:\s\-H|\-\-height)[\s]*([\d]+)/;

type PromptState = { value: string; config: PromptConfig };

const initialState: PromptState = {
  value: DEFAULT_VALUE,
  config: {
    prompt: DEFAULT_VALUE,
    iterations: 1,
    steps: 5,
    cfgscale: 7.5,
    sampler: "ddim",
    width: 512,
    height: 512,
    seed: -1,
    initimg: null,
    strength: 0.75,
    fit: "on",
    gfpgan_strength: 0.8,
    upscale_level: "",
    upscale_strength: 0.75,
    progress_images: "on",
  },
};

const parsePromptValue = (
  value: string
): Pick<
  PromptConfig,
  "prompt" | "seed" | "iterations" | "steps" | "width" | "height"
> => {
  const seed = parseNumberFromRegex(value, SEED_REGEX, -1);
  const iterations = parseNumberFromRegex(value, ITERATIONS_REGEX, 1);
  const steps = parseNumberFromRegex(value, STEPS_REGEX, 5);
  const width = parseNumberFromRegex(value, WIDTH_REGEX, 512);
  const height = parseNumberFromRegex(value, HEIGHT_REGEX, 512);
  const prompt = replaceAll(value, [
    SEED_REGEX,
    ITERATIONS_REGEX,
    STEPS_REGEX,
    WIDTH_REGEX,
    HEIGHT_REGEX,
  ]).trim();
  return { prompt, seed, iterations, steps, width, height };
};

export const promptSlice = createSlice({
  name: "prompt",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    change: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    parse: (state, action: PayloadAction<string>) => {
      const { payload: value } = action;
      state.value = value;
      const config = parsePromptValue(state.value);
      Object.assign(state.config, config);
    },
    seed: (state, action: PayloadAction<number>) => {
      const { payload: seed } = action;
      state.value = replaceOrAppend(state.value, SEED_REGEX, ` -S${seed}`);
      const config = parsePromptValue(state.value);
      Object.assign(state.config, config);
    },
  },
  extraReducers: (builder) => {},
});

export const {
  change: changePrompt,
  parse: parsePrompt,
  seed: seedPrompt,
} = promptSlice.actions;
export const { reducer: promptReducer } = promptSlice;
