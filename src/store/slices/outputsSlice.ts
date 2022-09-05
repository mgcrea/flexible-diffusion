import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PromptConfig, PromptOptions } from "src/types";
import { withPayloadType } from "src/utils";

type OutputResult = {
  event: "result";
  config: PromptConfig;
  seed: number;
  url: string;
};
type OutputStep = {
  event: "step";
  step: number;
  url: string | null;
};
type InlineStep = {
  step: number;
  url: string | null;
  createdAt: number;
};
export type OutputEntity = {
  id: string;
  options: PromptConfig;
  config: PromptConfig;
  seed: number;
  url: string;
  steps: InlineStep[];
  promptedAt: number;
  createdAt: number;
};

export const promptDefaults: PromptConfig = {
  prompt: "ocean",
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
};

const promptOutputConfig = createAction(
  "outputs/prompt/config",
  withPayloadType<PromptConfig>()
);
const promptOutputStep = createAction(
  "outputs/prompt/step",
  withPayloadType<OutputStep>()
);
const promptOutputResult = createAction(
  "outputs/prompt/result",
  withPayloadType<OutputResult>()
);
export const restoreOutputsState = createAction(
  "outputs/restore",
  withPayloadType<void>()
);

// export const restoreState = createAsyncThunk<void, null>(
//   "outputs/prompt",
//   // if you type your function argument here
//   async (options: PromptOptions, { getState, dispatch, rejectWithValue }) => {
//     const serializedState = localStorage.getItem('outputs');
//     if (serializedState) {
//       const state = JSON.parse(serializedState);
//     }
//     return serializedState;
//   }
// );

export const promptOutput = createAsyncThunk<OutputResult, PromptOptions>(
  "outputs/prompt",
  // if you type your function argument here
  async (options: PromptOptions, { getState, dispatch, rejectWithValue }) => {
    // const state = getState();
    const config = { ...promptDefaults, ...options };
    dispatch(promptOutputConfig(config));
    const body = JSON.stringify(config);
    const response = await fetch(`http://localhost:9090`, {
      method: "POST",
      body,
    });
    if (!response.body) {
      return rejectWithValue(new Error("Unexpected empty response.body"));
    }
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    let result: OutputResult | OutputStep | null = null;
    while (true) {
      let { value, done } = await reader.read();
      const decoded = textDecoder.decode(value);
      if (decoded) {
        result = JSON.parse(decoded) as OutputResult | OutputStep;
        if (result.event === "step") {
          dispatch(promptOutputStep(result));
        } else if (result.event === "result") {
          dispatch(promptOutputResult(result));
        } else {
          console.log("unknown event", (result as any).event);
        }
      }
      if (done) {
        break;
      }
    }
    if (!result) {
      return rejectWithValue(new Error("Unexpected empty reader.result"));
    }
    return result as OutputResult;
  }
);

type OutputsState = {
  entities: Record<string, OutputEntity>;
  entity: (Partial<OutputEntity> & { id: string }) | null;
  status: "idle" | "pending" | "working" | "succeeded" | "failed";
  currentStep: number;
  totalSteps: number;
};

const initialState: OutputsState = {
  entities: {},
  entity: null,
  status: "idle",
  currentStep: 0,
  totalSteps: 0,
};

const createEntity = (): Pick<OutputEntity, "id" | "promptedAt" | "steps"> => ({
  id: crypto.randomUUID(),
  promptedAt: Date.now(),
  steps: [],
});

export const outputsSlice = createSlice({
  name: "outputs",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    builder.addCase(restoreOutputsState, (state, { payload }) => {
      console.log("restore", payload);
      const serializedState = localStorage.getItem("outputs");
      console.log({ serializedState });
      if (serializedState) {
        return JSON.parse(serializedState);
      }
    });
    builder.addCase(promptOutput.pending, (state, action) => {
      console.log("pending", { action });
      state.status = "pending";
      state.entity = createEntity();
    });
    builder.addCase(promptOutputConfig, (state, { payload }) => {
      console.log("config", payload);
      state.totalSteps = payload.steps;
      state.entity!.options = payload;
    });
    builder.addCase(promptOutputStep, (state, { payload }) => {
      console.log("step", payload);
      const { event, ...otherProps } = payload;
      state.currentStep = payload.step;
      // @NOTE can happen when n > 1
      if (!state.entity) {
        state.entity = createEntity();
      }
      state.entity!.steps!.push({ ...otherProps, createdAt: Date.now() });
    });
    builder.addCase(promptOutputResult, (state, { payload }) => {
      console.log("result", payload);
      state.entity!.createdAt = Date.now();
      state.entity!.seed = payload.seed;
      state.entity!.url = payload.url;
      state.entity!.config = payload.config;
      state.entities[state.entity!.id] = state.entity! as OutputEntity;
      state.entity = null;
    });
    builder.addCase(promptOutput.fulfilled, (state, { payload }) => {
      state.status = "succeeded";
      console.log("fulfilled", payload);
    });
    builder.addCase(promptOutput.rejected, (state, { payload }) => {
      state.status = "failed";
      console.log("rejected", payload);
    });
  },
});

export const { reducer: outputsReducer } = outputsSlice;
