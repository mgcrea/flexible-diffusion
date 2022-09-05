import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PromptConfig, PromptOptions } from "src/types";

export const defaults: PromptConfig = {
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
};

export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:9090/",
});

// Define a service using a base URL and expected endpoints
export const dreamApi = createApi({
  reducerPath: "dreamApi",
  baseQuery,
  endpoints: (builder) => ({
    prompt: builder.mutation<any, Partial<PromptOptions>>({
      query: (options) => ({
        url: "/",
        method: "POST",
        body: { ...defaults, ...options },
      }),
      transformResponse: (response, meta, arg) => {
        console.log({ response });
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePromptMutation } = dreamApi;
