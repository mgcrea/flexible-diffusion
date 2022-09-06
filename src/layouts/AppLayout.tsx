import { FunctionComponent, HTMLProps } from "react";
import { HTMLStyleProps } from "src/types";
import { Aside, Header, Sidebar } from "./components";

export type AppLayoutProps = HTMLStyleProps<HTMLDivElement>;

export const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full">
      {/* Sidebar area */}
      {/* <Sidebar /> */}

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <Header /> */}

        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 pt-12">
            {/* Primary column */}
            <section aria-labelledby="primary-heading" className="flex h-full min-w-0 flex-1 flex-col lg:order-last">
              <h1 id="primary-heading" className="sr-only">
                Photos
              </h1>
              {children}
              {/* Your content */}
            </section>
          </main>

          {/* Secondary column (hidden on smaller screens) */}
          {/* <Aside className="hidden lg:block" /> */}
        </div>
      </div>
    </div>
  );
};
