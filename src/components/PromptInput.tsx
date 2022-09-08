import { BarsArrowUpIcon, FireIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FunctionComponent, HTMLProps, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { cancelOutput, changePrompt, parsePrompt, promptOutput, restorePrompt } from "src/store";
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
    dispatch(restorePrompt());
  }, []);

  // const [value, setValue] = useState<string>(lastValue);
  const onChange: TextAreaProps["onChange"] = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(parsePrompt(event.target.value));
  };
  const onKeyDown: TextAreaProps["onKeyDown"] = async (evt) => {
    const { key } = evt;
    // console.log({key});
    if (key === "Enter") {
      evt.preventDefault();
      await onDreamClick();
    } else if (key === " ") {
    }
  };
  const onDreamClick = async () => {
    await dispatch(parsePrompt(value));
    await dispatch(promptOutput({ input: value, ...prompt.config })).unwrap();
  };
  const onCancelClick = async () => {
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
            <NoSymbolIcon className="h-[24px] w-[24px] text-gray-400" aria-hidden="true" />
          </Button>
        ) : null}
        <Button onClick={onDreamClick} disabled={isDreaming} size="md">
          <>
            {isDreaming ? (
              <CircleIcon className="animate-spin h-[24px] w-[24px] mr-1" />
            ) : (
              <FireIcon
                className={classNames("h-[24px] w-[24px] text-gray-400 mr-1", isDreaming ? "animate-pulse" : "")}
                aria-hidden="true"
              />
            )}
            Dream
          </>
        </Button>
      </TextArea>
      <PromptProgress progress={progress * 100} status={status} />
      <PromptDetails config={config} />
    </div>
  );
};
