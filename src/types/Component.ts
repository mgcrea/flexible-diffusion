import { HTMLProps } from "react";

export type HTMLStyleProps<T extends HTMLElement = HTMLDivElement> = Pick<
  HTMLProps<T>,
  "className"
>;
