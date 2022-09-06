import { ChangeEvent, FunctionComponent, HTMLProps, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { changePrompt, parsePrompt, promptOutput } from "src/store";
import { Input, InputProps } from "./Input";

const PLACEHOLDER = "a photograph of an astronaut riding a horse";

export type PromptInputProps = HTMLProps<HTMLDivElement>;

export const PromptInput: FunctionComponent<PromptInputProps> = ({
  ...otherProps
}) => {
  const dispatch = useAppDispatch();
  const { status, currentStep, totalSteps } = useAppSelector(
    (state) => state.outputs
  );
  const prompt = useAppSelector((state) => state.prompt);
  const { value, config } = prompt;
  const progress = currentStep && totalSteps ? currentStep / totalSteps : 0;
  useEffect(() => {
    dispatch(parsePrompt(value));
  }, []);

  // const [value, setValue] = useState<string>(lastValue);
  const onChange: InputProps["onChange"] = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // setValue(event.target.value);
    // dispatch(change(event.target.value));
    dispatch(parsePrompt(event.target.value));
  };
  // const onBlur: InputProps["onChange"] = (
  //   event: ChangeEvent<HTMLInputElement>
  // ) => {
  //   dispatch(parsePrompt(event.target.value));
  // };
  const onKeyDown: InputProps["onKeyDown"] = async (evt) => {
    const { key } = evt;
    // console.log({key});
    if (key === "Enter") {
      evt.preventDefault();
      dispatch(parsePrompt(value));
      await dispatch(promptOutput(prompt.config)).unwrap();
    } else if (key === " ") {
    }
  };
  return (
    <div {...otherProps}>
      <Input
        value={value}
        label="Prompt a dream"
        placeholder={PLACEHOLDER}
        onChange={onChange}
        // onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      <div>{JSON.stringify(config)}</div>
      <div>
        {status} {(progress * 100).toFixed(2)}%
      </div>
    </div>
  );
};
