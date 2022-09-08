import { CameraIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ChangeEventHandler, DragEventHandler, FunctionComponent, useState } from "react";
import { classNames, HTMLStyleProps } from "src/utils";

export type FileInputProps = HTMLStyleProps<HTMLButtonElement> & {
  label?: string;
  onCancelClick?: () => void;
  onFileChange?: (file: File) => void;
  onFileLoad?: (file: File, base64: string | ArrayBuffer | null) => void;
};

export const FileInput: FunctionComponent<FileInputProps> = ({
  className,
  label,
  onFileChange,
  onFileLoad,
  onCancelClick,
}) => {
  const [value, setValue] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setValue(file);
    if (onFileChange) {
      onFileChange(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (onFileLoad) {
        onFileLoad(file, reader.result);
      }
    };
  };
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;
    if (!files?.length) {
      return;
    }
    handleFile(files[0]);
  };
  const onDrop: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (!files?.length) {
      return;
    }
    handleFile(files[0]);
  };
  return (
    <button
      type="button"
      className={classNames("bg-zinc-600 hover:enabled:bg-zinc-500 active:enabled:bg-zinc-700 rounded-md", className)}
      // onClick={(ev) => ev.preventDefault()}
    >
      <label
        className={
          "cursor-pointer px-2 py-1 text-xs font-medium flex items-center justify-center rounded-md focus:outline-none text-gray-100 "
        }
        onDragOver={(ev) => {
          ev.preventDefault();
          ev.dataTransfer.dropEffect = "copy";
        }}
        onDrop={onDrop}
      >
        <CameraIcon className="w-4 h-4" />
        <span className="text-xs font-medium px-1">{value ? value.name : null}</span>
        {label ? <span className="text-[12px]">{label}</span> : null}
        <input type="file" className="hidden" onChange={onChange}></input>
        {value ? (
          <XCircleIcon
            className="w-4 h-4 ml-1 cursor-pointer"
            onClick={(ev) => {
              ev.preventDefault();
              setValue(null);
              if (onCancelClick) {
                onCancelClick();
              }
            }}
          />
        ) : null}
      </label>
    </button>
  );
};
