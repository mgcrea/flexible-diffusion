import { FingerPrintIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FunctionComponent } from "react";
import { DREAM_API_HOST } from "src/config/env";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { deleteOutputEntityById, OutputEntity, paramPrompt, selectOrderedEntities } from "src/store";
import { HTMLStyleProps } from "src/types";
import { Button, IconButton } from "./Button";

export type ImageGridProps = HTMLStyleProps<HTMLDivElement>;

export const ImageGrid: FunctionComponent<ImageGridProps> = ({ ...otherProps }) => {
  // const { entities, entity } = useAppSelector((state) => state.outputs);
  const list = useAppSelector((state) => selectOrderedEntities(state));
  const dispatch = useAppDispatch();
  const onDeleteClick = (id: string) => {
    console.log(`delete ${id}`);
    dispatch(deleteOutputEntityById(id));
  };
  return (
    <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-6 sm:grid-cols-2 md:grid-cols-4 xl:gap-x-8 xl:gap-y-8">
      {list.map((value) => (
        <div key={value.id} className="relative group">
          <ImageGridItem onDeleteClick={onDeleteClick} value={value} />
        </div>
      ))}
    </div>
  );
};

export type ImageGridItemProps = HTMLStyleProps & {
  value: OutputEntity;
  onDeleteClick: (id: string) => void;
};

export const ImageGridItem: FunctionComponent<ImageGridItemProps> = ({ value, onDeleteClick, ...otherProps }) => {
  const dispatch = useAppDispatch();
  const imgSrc = `${DREAM_API_HOST}/${value.url}`;
  return (
    <div className="relative">
      <div className="overflow-hidden bg-gray-400 dark:bg-gray-400 border-transparent rounded-md border-2 group-hover:border-indigo-400 min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-95">
        <img src={imgSrc} className="object-cover object-center" />
      </div>
      <div className="absolute bottom-0 left-0 p-2 opacity-75 group-hover:opacity-100">
        {/* <div className="px-2 py-1 text-xs font-medium text-center text-gray-600 bg-white bg-opacity-50 border-gray-500 border-solid rounded-md backdrop-filter border-1">
          {value.seed}
        </div> */}
        <Button size="xs" overlay onClick={() => dispatch(paramPrompt(["seed", value.seed]))}>
          <FingerPrintIcon className="w-3 h-3" aria-hidden="true" />
          <span className="pl-1 mb-[-1px]">{value.seed}</span>
        </Button>
      </div>

      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100">
        <IconButton overlay onClick={() => onDeleteClick(value.id)}>
          <TrashIcon className="w-3 h-3" aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
};
