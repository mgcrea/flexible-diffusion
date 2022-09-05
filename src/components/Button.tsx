import React, {
  ButtonHTMLAttributes,
  FunctionComponent,
  HTMLProps,
} from "react";
import { classNames } from "src/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = "button",
  className,
  ...otherProps
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "px-2 py-1 text-xs font-medium opacity-80 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 active:bg-gray-200 focus:outline-none",
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
