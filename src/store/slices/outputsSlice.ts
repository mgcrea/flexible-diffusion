import { createAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PromptConfig, PromptOptions } from "src/types";
import { withPayloadType } from "src/utils";
import { PROMPT_DEFAULTS } from "./promptSlice";

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
type CanceledStep = {
  event: "canceled";
};
type UnknownOutputStep = OutputResult | OutputStep | CanceledStep;
type InlineStep = {
  step: number;
  url: string | null;
  createdAt: number;
};
export type OutputEntity = {
  id: string;
  input: string;
  options: PromptConfig;
  config: PromptConfig;
  seed: number;
  url: string;
  steps: InlineStep[];
  promptedAt: number;
  createdAt: number;
};
export type PartialEntity = Partial<OutputEntity> & Pick<OutputEntity, "id" | "steps" | "promptedAt">;

const promptOutputConfig = createAction("outputs/prompt/config", withPayloadType<PromptConfig>());
const promptOutputStep = createAction("outputs/prompt/step", withPayloadType<OutputStep>());
const promptOutputResult = createAction("outputs/prompt/result", withPayloadType<OutputResult>());
export const deleteOutputEntityById = createAction("outputs/entities/delete", withPayloadType<string>());
export const restoreOutputsState = createAction("outputs/restore", withPayloadType<void>());

export const promptOutput = createAsyncThunk<OutputResult, PromptOptions>(
  "outputs/prompt",
  async (options: PromptOptions, { dispatch, getState, rejectWithValue }) => {
    const config = { ...PROMPT_DEFAULTS, ...options };
    dispatch(promptOutputConfig(config));
    const body = JSON.stringify(config);
    const response = await fetch("/dream", {
      method: "POST",
      body,
    });
    if (!response.body) {
      return rejectWithValue(new Error("Unexpected empty response.body"));
    }
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    let result: UnknownOutputStep | null = null;
    while (true) {
      let { value, done } = await reader.read();
      const decoded = textDecoder.decode(value);
      if (decoded) {
        result = JSON.parse(decoded) as UnknownOutputStep;
        if (result.event === "step") {
          dispatch(promptOutputStep(result));
        } else if (result.event === "result") {
          dispatch(promptOutputResult(result));
        } else if (result.event === "canceled") {
          dispatch(canceledOutput(result));
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

export const cancelOutput = createAsyncThunk<void, void>("outputs/prompt", async (_, { dispatch, rejectWithValue }) => {
  const response = await fetch(`/cancel`, {
    method: "GET",
  });
  const body = await response.json();
  console.log({ body });
});

type OutputsState = {
  entities: Record<string, OutputEntity>;
  entity: PartialEntity | null;
  status: "idle" | "pending" | "loading" | "succeeded" | "failed" | "canceled";
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

const createEntity = (): PartialEntity => ({
  id: crypto.randomUUID(),
  promptedAt: Date.now(),
  steps: [],
});

export const outputsSlice = createSlice({
  name: "outputs",
  initialState,
  reducers: {
    canceled: (state, action: PayloadAction<CanceledStep>) => {
      // state.status = "canceled";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreOutputsState, (state, { payload }) => {
      const serializedState = localStorage.getItem("outputs");
      if (serializedState) {
        const restoredState = JSON.parse(serializedState);
        return { ...initialState, ...restoredState };
      }
    });
    builder.addCase(deleteOutputEntityById, (state, { payload }) => {
      console.log("delete", payload);
      delete state.entities[payload];
    });
    builder.addCase(promptOutput.pending, (state, action) => {
      console.log("pending", { action });
      state.status = "pending";
      state.currentStep = 0;
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
      state.status = "loading";
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
      console.log("fulfilled", payload);
      if (payload?.event === "result") {
        state.status = "succeeded";
      } else if (payload?.event === "canceled") {
        state.status = "canceled";
      }
    });
    builder.addCase(promptOutput.rejected, (state, { payload }) => {
      state.status = "failed";
      console.log("rejected", payload);
    });
  },
});

export const { canceled: canceledOutput } = outputsSlice.actions;
export const { reducer: outputsReducer } = outputsSlice;
