import { HTMLProps } from "react";

export type HTMLStyleProps<T extends HTMLElement = HTMLDivElement> = Pick<
  HTMLProps<T>,
  "className" | "children" | "title"
>;

export function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
