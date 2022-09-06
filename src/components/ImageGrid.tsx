import { SparklesIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FunctionComponent, HTMLProps } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks";
import {
  deleteOutputEntityById,
  OutputEntity,
  seedPrompt,
  selectOrderedEntities,
} from "src/store";
import { HTMLStyleProps } from "src/types";
import { Button } from "./Button";

export type ImageGridProps = HTMLProps<HTMLDivElement>;

export const ImageGrid: FunctionComponent<ImageGridProps> = ({
  ...otherProps
}) => {
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

export const ImageGridItem: FunctionComponent<ImageGridItemProps> = ({
  value,
  onDeleteClick,
  ...otherProps
}) => {
  const dispatch = useAppDispatch();
  const imgSrc = `http://localhost:9090/${value.url.slice(1)}`;
  return (
    <div className="relative">
      <div className="overflow-hidden bg-gray-200 border-2 border-transparent rounded-md group-hover:border-purple-400 min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-95">
        <img src={imgSrc} className="object-cover object-center" />
      </div>
      <div className="absolute bottom-0 left-0 p-2 opacity-75 group-hover:opacity-100">
        {/* <div className="px-2 py-1 text-xs font-medium text-center text-gray-600 bg-white bg-opacity-50 border-gray-500 border-solid rounded-md backdrop-filter border-1">
          {value.seed}
        </div> */}
        <Button
          size="xs"
          className="flex items-center justify-center backdrop-filter"
          onClick={() => dispatch(seedPrompt(value.seed))}
        >
          {/* D&nbsp;
          <span className="hidden group-hover:inline">{value.seed}</span> */}

          <SparklesIcon className="w-3 h-3" aria-hidden="true" />
          <span className="pl-1 mb-[-1px]">{value.seed}</span>
        </Button>
      </div>

      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100">
        <Button
          className="flex items-center justify-center w-5 h-5 px-0 py-0 backdrop-filter"
          onClick={() => onDeleteClick(value.id)}
        >
          <TrashIcon className="w-3 h-3" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
