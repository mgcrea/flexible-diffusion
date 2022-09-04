import React, { FunctionComponent, HTMLProps } from "react";
import { PromptInput } from "src/components";

export type BasicScreenProps = HTMLProps<HTMLDivElement>;

export const BasicScreen: FunctionComponent<BasicScreenProps> = ({
  ...otherProps
}) => {
  return (
    <div {...otherProps}>
      <PromptInput />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};
