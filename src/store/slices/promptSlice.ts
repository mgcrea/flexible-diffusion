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
  cfgscale: 7.5,
  fit: "on",
  gfpgan_strength: 0.8,
  height: 512,
  initimg_name: "",
  initimg: null,
  iterations: 1,
  prompt: "",
  sampler: "k_lms",
  seed: -1,
  steps: 5,
  strength: 0.75,
  upscale_level: "",
  upscale_strength: 0.75,
  variation_amount: 0,
  width: 512,
  with_variations: "",
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
  variation_amount: /\s(?:\-v|\-\-variation_amount)[\s]*([\d\.]+)/,
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
  variation_amount: "-v",
};

export type ParseableArgs = keyof typeof PROMPT_REGEXES;

const parsePromptValue = (value: string): Pick<PromptConfig, ParseableArgs & { prompt: string }> => {
  const seed = parseNumberFromRegex(value, PROMPT_REGEXES.seed, DEFAULTS.seed);
  const iterations = parseNumberFromRegex(value, PROMPT_REGEXES.iterations, DEFAULTS.iterations);
  const steps = parseNumberFromRegex(value, PROMPT_REGEXES.steps, DEFAULTS.steps);
  const width = parseNumberFromRegex(value, PROMPT_REGEXES.width, DEFAULTS.width);
  const height = parseNumberFromRegex(value, PROMPT_REGEXES.height, DEFAULTS.height);
  const cfgscale = parseFloatFromRegex(value, PROMPT_REGEXES.cfgscale, DEFAULTS.cfgscale);
  const sampler = parseStringFromRegex(value, PROMPT_REGEXES.sampler, DEFAULTS.sampler);
  const strength = parseFloatFromRegex(value, PROMPT_REGEXES.strength, DEFAULTS.strength);
  const variation_amount = parseFloatFromRegex(value, PROMPT_REGEXES.variation_amount, DEFAULTS.variation_amount);
  const prompt = replaceAll(value, Object.values(PROMPT_REGEXES)).trim();
  return { prompt, seed, iterations, steps, width, height, cfgscale, sampler, strength, variation_amount };
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
