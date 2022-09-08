// Vite environment
export const NODE_ENV = import.meta.env.MODE;
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;
export const IS_SSR = import.meta.env.SSR;

export const DREAM_API_HOST = IS_DEV ? "" : "http://localhost:9090";
