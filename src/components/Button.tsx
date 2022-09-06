import React, {
  ButtonHTMLAttributes,
  FunctionComponent,
  HTMLProps,
  ReactElement,
} from "react";
import { classNames } from "src/utils";

type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClassNames: Record<SizeType, string> = {
  xs: "px-2 py-1 text-xs font-medium",
  sm: "px-4 py-2 text-sm font-medium",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-4 py-2 text-sm font-medium",
  xl: "px-4 py-2 text-sm font-medium",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: SizeType;
};

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = "button",
  className,
  size = "md",
  ...otherProps
}) => {
  return (
    <button
      type={type}
      className={classNames(
        sizeClassNames[size],
        "opacity-80 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 active:bg-gray-200 focus:outline-none",
        // "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 active:bg-gray-200 focus:outline-none",
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
};

// focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
