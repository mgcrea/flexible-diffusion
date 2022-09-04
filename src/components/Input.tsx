import React, { FunctionComponent, HTMLProps } from "react";
import tw from "tailwind-styled-components";

export type InputProps = HTMLProps<HTMLInputElement>;

export const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className,
  ...inputProps
}) => {
  return (
    <ContainerElement>
      {label ? <LabelElement htmlFor={name}>{label}</LabelElement> : null}
      <InputElement name={name} type="text" {...inputProps} />
    </ContainerElement>
  );
};

const ContainerElement = tw.div`
relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600
`;
const LabelElement = tw.label`
absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900
`;
const InputElement = tw.input`
h-12 block w-full border-0 p-0 bg-transparent text-gray-800 placeholder-gray-400 focus:ring-0 text-md
`;
// block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm
