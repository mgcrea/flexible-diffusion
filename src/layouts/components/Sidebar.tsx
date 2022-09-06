import {
  CogIcon,
  HomeIcon,
  PhotoIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { FunctionComponent, HTMLProps } from "react";
import { classNames } from "src/utils";

const sidebarNavigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: false },
  { name: "All Files", href: "#", icon: Squares2X2Icon, current: false },
  { name: "Dream", href: "#", icon: PhotoIcon, current: true },
  { name: "Shared", href: "#", icon: UserGroupIcon, current: false },
  { name: "Albums", href: "#", icon: RectangleStackIcon, current: false },
  { name: "Settings", href: "#", icon: CogIcon, current: false },
];

export type SidebarProps = HTMLProps<HTMLDivElement>;

export const Sidebar: FunctionComponent<SidebarProps> = ({ ...otherProps }) => {
  return (
    <div className="hidden w-28 overflow-y-auto bg-indigo-700 md:block">
      <div className="flex w-full flex-col items-center py-6">
        <div className="flex flex-shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
            alt="Your Company"
          />
        </div>
        <div className="mt-6 w-full flex-1 space-y-1 px-2">
          {sidebarNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-indigo-800 text-white"
                  : "text-indigo-100 hover:bg-indigo-800 hover:text-white",
                "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-white"
                    : "text-indigo-300 group-hover:text-white",
                  "h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="mt-2">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
