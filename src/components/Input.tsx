import React, { FunctionComponent, HTMLProps } from "react";
import { classNames } from "src/utils";
import tw from "tailwind-styled-components";

export type InputProps = HTMLProps<HTMLInputElement>;

export const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className,
  disabled,
  type = "text",
  children,
  ...inputProps
}) => {
  return (
    <div
      className={classNames(
        "relative flex flex-row px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600",
        disabled ? "bg-gray-100" : null
      )}
    >
      {label ? (
        <label
          htmlFor={name}
          className="absolute inline-block px-1 -mt-px text-xs font-medium text-gray-900 bg-white rounded-md -top-2 left-2"
        >
          {label}
        </label>
      ) : null}
      <input
        name={name}
        type={type}
        disabled={disabled}
        className="block w-full h-12 p-0 text-gray-800 placeholder-gray-400 bg-transparent border-0 dark:text-gray-200 focus:ring-0 text-md"
        {...inputProps}
      />
      {children}
    </div>
  );
};
