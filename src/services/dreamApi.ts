import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PROMPT_DEFAULTS } from "src/store";
import { PromptConfig, PromptOptions } from "src/types";

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
        body: { ...PROMPT_DEFAULTS, ...options },
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
