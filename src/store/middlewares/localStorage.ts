import { Middleware } from "@reduxjs/toolkit";
import { deleteOutputEntityById, promptOutput } from "../slices";

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    // if (action.type?.startsWith("outputs/")) {
    if (
      promptOutput.fulfilled.match(action) ||
      deleteOutputEntityById.match(action)
    ) {
      const { outputs } = store.getState();
      console.log("saved!");
      localStorage.setItem(
        "outputs",
        JSON.stringify({ entities: outputs.entities })
      );
    }
    return result;
  };
