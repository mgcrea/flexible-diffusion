import { BarsArrowUpIcon, FireIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FunctionComponent, HTMLProps, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { cancelOutput, changePrompt, parsePrompt, promptOutput } from "src/store";
import { Button } from "./Button";
import { Input, InputProps } from "./Input";
import { PromptDetails } from "./PromptDetails";
import { PromptProgress } from "./PromptProgress";
import { ReactComponent as CircleIcon } from "src/assets/circle.svg";
import { TextArea, TextAreaProps } from "./TextArea";
import { classNames } from "src/utils";

const PLACEHOLDER = "a photograph of an astronaut riding a horse";

export type PromptInputProps = HTMLProps<HTMLDivElement>;

export const PromptInput: FunctionComponent<PromptInputProps> = ({ ...otherProps }) => {
  const dispatch = useAppDispatch();
  const { status, currentStep, totalSteps } = useAppSelector((state) => state.outputs);
  const prompt = useAppSelector((state) => state.prompt);
  const { value, config } = prompt;
  const progress = currentStep && totalSteps ? currentStep / totalSteps : 0;
  const isDreaming = ["pending", "loading"].includes(status);

  useEffect(() => {
    dispatch(parsePrompt(value));
  }, []);

  // const [value, setValue] = useState<string>(lastValue);
  const onChange: TextAreaProps["onChange"] = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // setValue(event.target.value);
    // dispatch(change(event.target.value));
    dispatch(parsePrompt(event.target.value));
  };
  // const onBlur: InputProps["onChange"] = (
  //   event: ChangeEvent<HTMLInputElement>
  // ) => {
  //   dispatch(parsePrompt(event.target.value));
  // };
  const onKeyDown: TextAreaProps["onKeyDown"] = async (evt) => {
    const { key } = evt;
    // console.log({key});
    if (key === "Enter") {
      evt.preventDefault();
      dispatch(parsePrompt(value));
      await dispatch(promptOutput(prompt.config)).unwrap();
    } else if (key === " ") {
    }
  };
  const onDreamClick = async () => {
    console.log("click!");
    dispatch(parsePrompt(value));
    await dispatch(promptOutput(prompt.config)).unwrap();
  };
  const onCancelClick = async () => {
    console.log("click!");
    await dispatch(cancelOutput()).unwrap();
  };
  const { initimg, ...otherPromptConfig } = config;
  return (
    <div {...otherProps}>
      <TextArea
        value={value}
        label="Prompt a dream"
        placeholder={PLACEHOLDER}
        onChange={onChange}
        // onBlur={onBlur}
        onKeyDown={onKeyDown}
        // disabled={["pending", "loading"].includes(status)}
      >
        {isDreaming ? (
          <Button onClick={onCancelClick} disabled={!isDreaming} className="mr-2" title="Cancel">
            <NoSymbolIcon className="h-[32px] w-[32px] text-gray-400" aria-hidden="true" />
          </Button>
        ) : null}
        <Button onClick={onDreamClick} disabled={isDreaming} size="xl">
          <>
            {isDreaming ? (
              <CircleIcon className="animate-spin h-[32px] w-[32px] mr-2" />
            ) : (
              <FireIcon
                className={classNames("h-[32px] w-[32px] text-gray-400 mr-2", isDreaming ? "animate-pulse" : "")}
                aria-hidden="true"
              />
            )}
            {/* <img src={loadingIcon} className="h-8 w-8 fill-rose-900" alt="loading" /> */}
            Dream
          </>
        </Button>
      </TextArea>
      <PromptProgress progress={progress * 100} status={status} />
      <PromptDetails config={config} />
    </div>
  );
};
