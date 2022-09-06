import { configureStore } from "@reduxjs/toolkit";
import { dreamApi } from "src/services";
import { localStorageMiddleware } from "./middlewares";
import { outputsSlice, promptSlice } from "./slices";

export const store = configureStore({
  reducer: {
    [dreamApi.reducerPath]: dreamApi.reducer,
    outputs: outputsSlice.reducer,
    prompt: promptSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...[localStorageMiddleware, dreamApi.middleware]
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppSelector<
  Result = unknown,
  Params extends never | readonly any[] = any[]
> = [Params] extends [never]
  ? (state: RootState) => Result
  : (state: RootState, ...params: Params) => Result;
