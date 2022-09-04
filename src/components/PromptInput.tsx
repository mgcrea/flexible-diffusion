import React, { FunctionComponent, HTMLProps } from "react";
import { Input } from "./Input";

export type PromptInputProps = HTMLProps<HTMLDivElement>;

export const PromptInput: FunctionComponent<PromptInputProps> = ({
  ...otherProps
}) => {
  return (
    <div {...otherProps}>
      <Input
        label="Prompt what you want to render"
        placeholder="a photograph of an astronaut riding a horse"
        onKeyDown={(evt) => {
          const { key } = evt;
          if (key === "Enter") {
            console.warn("enter");
            evt.preventDefault();
          }
        }}
      />
    </div>
  );
};
