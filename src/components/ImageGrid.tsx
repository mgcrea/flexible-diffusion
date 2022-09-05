import React, { FunctionComponent, HTMLProps } from "react";
import { useAppSelector } from "src/hooks";
import { orderBy } from "lodash-es";
import { OutputEntity, selectOrderedEntities } from "src/store";
import { Button } from "./Button";

export type ImageGridProps = HTMLProps<HTMLDivElement>;

export const ImageGrid: FunctionComponent<ImageGridProps> = ({
  ...otherProps
}) => {
  const products = [{ id: 0 }, { id: 1 }];
  const { entities } = useAppSelector((state) => state.outputs);
  const list = useAppSelector((state) => selectOrderedEntities(state));
  return (
    <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {list.map((value) => (
        <div key={value.id} className="relative group">
          <ImageGridItem value={value} />
        </div>
      ))}
    </div>
  );
};

export type ImageGridItemProps = {
  value: OutputEntity;
};

export const ImageGridItem: FunctionComponent<ImageGridItemProps> = ({
  value,
  ...otherProps
}) => {
  const imgSrc = `http://localhost:9090/${value.url.slice(1)}`;
  return (
    <div className="relative">
      <div className="overflow-hidden bg-gray-200 border-2 border-transparent rounded-md group-hover:border-purple-400 min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-95">
        <img src={imgSrc} className="object-cover object-center" />
        {/* <div
        className="flex items-end p-4 opacity-0 group-hover:opacity-100"
        aria-hidden="true"
      >
        <div className="w-full px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white bg-opacity-75 rounded-md backdrop-blur backdrop-filter">
          View Product
        </div>
      </div> */}
        {/* <div className="absolute top-0 flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 backdrop-filter">
        <button className="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white bg-opacity-75 rounded-md backdrop-blur backdrop-filter">
          X
        </button>
      </div> */}
      </div>
      <div className="absolute bottom-0 left-0 p-2">
        {/* <div className="px-2 py-1 text-xs font-medium text-center text-gray-600 bg-white bg-opacity-50 border-gray-500 border-solid rounded-md backdrop-filter border-1">
          {value.seed}
        </div> */}
        <Button className="backdrop-filter">{value.seed}</Button>
      </div>

      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100">
        <Button className="backdrop-filter">x</Button>
      </div>
    </div>
  );
};
