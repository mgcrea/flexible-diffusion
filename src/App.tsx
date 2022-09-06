import { BasicScreen } from "./screens";
import { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { AppLayout } from "./layouts";

export const App: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <AppLayout>
        <BasicScreen />
      </AppLayout>
    </Provider>
  );
};
