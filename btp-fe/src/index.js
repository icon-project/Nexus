import { inspect } from "@xstate/inspect";
import { render } from "react-dom";
import { App } from "./components/App";
// import dev from "./utils/dev";

inspect({
  iframe: false,
});

render(<App />, document.getElementById("root"));
