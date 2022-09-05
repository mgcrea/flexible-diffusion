import React, { FunctionComponent, HTMLProps, useEffect } from "react";
import { Counter, PromptInput, Image, ImageGrid } from "src/components";
import { useAppDispatch } from "src/hooks";
import { restoreOutputsState } from "src/store";

export type BasicScreenProps = HTMLProps<HTMLDivElement>;

export const BasicScreen: FunctionComponent<BasicScreenProps> = ({
  ...otherProps
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(restoreOutputsState());
  }, []);
  return (
    <div {...otherProps}>
      <PromptInput />
      <br />
      <ImageGrid />
    </div>
  );
};
