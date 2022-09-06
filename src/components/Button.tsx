import React, { ButtonHTMLAttributes, FunctionComponent, HTMLProps, ReactElement } from "react";
import { classNames } from "src/utils";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant = "light" | "dark";

const sizeClassNames: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs font-medium",
  sm: "px-4 py-2 text-sm font-medium",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-4 py-2 text-sm font-medium",
  xl: "px-4 py-2 text-sm font-medium",
};
const variantClassNames: Record<ButtonVariant, string> = {
  light: "text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 active:bg-gray-200",
  dark: "text-gray-100 bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-700",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  overlay?: boolean;
};

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  type = "button",
  className,
  size = "sm",
  variant = "light",
  overlay,
  ...otherProps
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "flex items-center justify-center rounded-md focus:outline-none",
        sizeClassNames[size],
        variantClassNames[variant],
        overlay ? "opacity-80 backdrop-filter" : "",
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
};

// focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2

export const IconButton: FunctionComponent<ButtonProps> = ({ children, className, ...otherProps }) => {
  return (
    <Button className={classNames("w-5 h-5 px-0 py-0 rounded-full", className)} {...otherProps}>
      {children}
    </Button>
  );
};
