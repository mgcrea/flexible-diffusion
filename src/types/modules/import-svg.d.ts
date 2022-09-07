// declare module '*.svg' {
//   import {FunctionComponent, SVGAttributes} from 'react';
//   const value: string;
//   export const ReactComponent: FunctionComponent<SVGAttributes<SVGElement>>;
//   export default value;
// }

declare module "*.svg" {
  import type { FunctionComponent, SVGProps } from "react";
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
  export { ReactComponent };
}

// declare module "*.svg?component" {
//   import type { FunctionComponent, SVGProps } from "react";
//   const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
//   export default ReactComponent;
// }
