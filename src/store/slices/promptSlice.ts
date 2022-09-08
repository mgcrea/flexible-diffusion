import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../root";
import { PromptConfig, PromptOptions } from "src/types";
import {
  keyExists,
  parseFloatFromRegex,
  parseNumberFromRegex,
  parseStringFromRegex,
  replaceAll,
  replaceOrAppend,
} from "src/utils";

const DEFAULT_VALUE = "a photograph of an astronaut riding a horse";

type PromptState = { value: string; config: PromptConfig };

export const PROMPT_DEFAULTS: PromptConfig = {
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
  config: { ...PROMPT_DEFAULTS },
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
export type AllArgs = ParseableArgs | "initimg";

const parsePromptValue = (value: string): Pick<PromptConfig, ParseableArgs & { prompt: string }> => {
  const seed = parseNumberFromRegex(value, PROMPT_REGEXES.seed, PROMPT_DEFAULTS.seed);
  const iterations = parseNumberFromRegex(value, PROMPT_REGEXES.iterations, PROMPT_DEFAULTS.iterations);
  const steps = parseNumberFromRegex(value, PROMPT_REGEXES.steps, PROMPT_DEFAULTS.steps);
  const width = parseNumberFromRegex(value, PROMPT_REGEXES.width, PROMPT_DEFAULTS.width);
  const height = parseNumberFromRegex(value, PROMPT_REGEXES.height, PROMPT_DEFAULTS.height);
  const cfgscale = parseFloatFromRegex(value, PROMPT_REGEXES.cfgscale, PROMPT_DEFAULTS.cfgscale);
  const sampler = parseStringFromRegex(value, PROMPT_REGEXES.sampler, PROMPT_DEFAULTS.sampler);
  const strength = parseFloatFromRegex(value, PROMPT_REGEXES.strength, PROMPT_DEFAULTS.strength);
  const variation_amount = parseFloatFromRegex(
    value,
    PROMPT_REGEXES.variation_amount,
    PROMPT_DEFAULTS.variation_amount
  );
  const prompt = replaceAll(value, Object.values(PROMPT_REGEXES)).trim();
  return { prompt, seed, iterations, steps, width, height, cfgscale, sampler, strength, variation_amount };
};

export const promptSlice = createSlice({
  name: "prompt",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    restore: (state, action: PayloadAction<void>) => {
      const serializedState = localStorage.getItem("prompt");
      if (serializedState) {
        const restoredState = JSON.parse(serializedState);
        console.log({ restoredState: restoredState.value });
        return { ...initialState, ...restoredState };
      }
    },
    change: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    parse: (state, action: PayloadAction<string | undefined>) => {
      const { payload: value } = action;
      if (value) {
        state.value = value;
      }
      const config = parsePromptValue(state.value);
      Object.assign(state.config, config);
    },
    param: (state, action: PayloadAction<[AllArgs, unknown]>) => {
      const [key, value] = action.payload;
      if (key === "initimg") {
        console.log({ key, value });
        if (value === null) {
          state.config.initimg = null;
          state.config.initimg_name = "";
          return;
        }
        const [initimg_name, initimg] = (value as string).split("|");
        state.config.initimg = initimg;
        state.config.initimg_name = initimg_name;
      } else {
        state.value = replaceOrAppend(state.value, PROMPT_REGEXES[key], ` ${PROMPT_SHORT_ARGS[key]}${value}`);
        const config = parsePromptValue(state.value);
        Object.assign(state.config, config);
      }
    },
  },
  extraReducers: (builder) => {},
});

export const {
  restore: restorePrompt,
  change: changePrompt,
  parse: parsePrompt,
  param: paramPrompt,
} = promptSlice.actions;
export const { reducer: promptReducer } = promptSlice;
