import { Middleware } from "@reduxjs/toolkit";
import { deleteOutputEntityById, paramPrompt, parsePrompt, promptOutput } from "../slices";

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // if (action.type?.startsWith("outputs/")) {
  if (promptOutput.fulfilled.match(action) || deleteOutputEntityById.match(action)) {
    const { outputs } = store.getState();
    localStorage.setItem("outputs", JSON.stringify({ entities: outputs.entities }));
  } else if (parsePrompt.match(action) || paramPrompt.match(action)) {
    const { prompt } = store.getState();
    localStorage.setItem("prompt", JSON.stringify(prompt));
  }
  return result;
};
