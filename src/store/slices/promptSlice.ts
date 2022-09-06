import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../root";
import { PromptConfig, PromptOptions } from "src/types";
import {
  parseFloatFromRegex,
  parseNumberFromRegex,
  parseStringFromRegex,
  replaceAll,
  replaceOrAppend,
} from "src/utils";

const DEFAULT_VALUE = "a photograph of an astronaut riding a horse";

type PromptState = { value: string; config: PromptConfig };

const DEFAULTS: PromptConfig = {
  prompt: "",
  iterations: 1,
  steps: 5,
  cfgscale: 7.5,
  sampler: "k_lms",
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
};

const initialState: PromptState = {
  value: DEFAULT_VALUE,
  config: DEFAULTS,
};

export const PROMPT_REGEXES = {
  seed: /\s(?:\-S|\-\-seed)[\s]*(\-?[\d]+)/,
  steps: /\s(?:\-s|\-\-steps)[\s]*([\d]+)/,
  iterations: /\s(?:\-n|\-\-iterations)[\s]*([\d]+)/,
  width: /\s(?:\-W|\-\-width)[\s]*([\d]+)/,
  height: /\s(?:\-H|\-\-height)[\s]*([\d]+)/,
  cfgscale: /\s(?:\-C|\-\-cfg_scale)[\s]*([\d\.]+)/,
  sampler: /\s(?:\-A|\-m|\-\-sampler)[\s]*([a-z_]+)/,
  strength: /\s(?:\-f|\-\-strength)[\s]*([\d\.]+)/,
};
export const PROMPT_SHORT_ARGS = {
  seed: "-S",
  steps: "-s",
  iterations: "-n",
  width: "-W",
  height: "-H",
  cfgscale: "-C",
  sampler: "-A",
  strength: "-f",
};

export type ParseableArgs = keyof typeof PROMPT_REGEXES;

const parsePromptValue = (value: string): Pick<PromptConfig, ParseableArgs & { prompt: string }> => {
  const seed = parseNumberFromRegex(value, PROMPT_REGEXES.seed, -1);
  const iterations = parseNumberFromRegex(value, PROMPT_REGEXES.iterations, DEFAULTS.iterations);
  const steps = parseNumberFromRegex(value, PROMPT_REGEXES.steps, DEFAULTS.steps);
  const width = parseNumberFromRegex(value, PROMPT_REGEXES.width, DEFAULTS.width);
  const height = parseNumberFromRegex(value, PROMPT_REGEXES.height, DEFAULTS.height);
  const cfgscale = parseFloatFromRegex(value, PROMPT_REGEXES.cfgscale, DEFAULTS.cfgscale);
  // const sampler = parseStringFromRegex(value, PROMPT_REGEXES.sampler, "k_lms");
  const strength = parseFloatFromRegex(value, PROMPT_REGEXES.strength, DEFAULTS.strength);
  const prompt = replaceAll(value, Object.values(PROMPT_REGEXES)).trim();
  return { prompt, seed, iterations, steps, width, height, cfgscale, strength };
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
    param: (state, action: PayloadAction<[keyof typeof PROMPT_REGEXES, unknown]>) => {
      const [key, value] = action.payload;
      state.value = replaceOrAppend(state.value, PROMPT_REGEXES[key], ` ${PROMPT_SHORT_ARGS[key]}${value}`);
      const config = parsePromptValue(state.value);
      Object.assign(state.config, config);
    },
  },
  extraReducers: (builder) => {},
});

export const { change: changePrompt, parse: parsePrompt, param: paramPrompt } = promptSlice.actions;
export const { reducer: promptReducer } = promptSlice;
