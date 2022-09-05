import { BasicScreen } from "./screens";
import { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

export const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <BasicScreen />
    </Provider>
  );
};
