import React, { FunctionComponent, HTMLProps } from "react";

export type ImageProps = HTMLProps<HTMLImageElement>;

export const Image: FunctionComponent<ImageProps> = ({ ...otherProps }) => {
  return (
    <div {...otherProps}>
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-[512px] h-[512px] overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img
          src="http://localhost:9090/outputs/img-samples/000098.2988193647.png"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
    </div>
  );
};
