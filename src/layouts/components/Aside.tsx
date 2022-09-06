import React, { FunctionComponent, HTMLProps } from "react";
import { HTMLStyleProps } from "src/types";

export type AsideProps = HTMLStyleProps<HTMLDivElement>;

export const Aside: FunctionComponent<AsideProps> = ({ ...otherProps }) => {
  return (
    <aside className="w-96 overflow-y-auto border-l border-gray-200 bg-white">
      {/* Your content */}
    </aside>
  );
};
