import { lazy, Suspense, StrictMode, useEffect } from "react";
import { Global, css } from "@emotion/react";
import { useMachine } from "@xstate/react";
import { appMachine } from "../machines";
import Landing from "./Landing";

const appStyles = css`
  html {
    height: 100%;
  }

  *,
  *:before,
  *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

export const App = () => {
  const [{ matches, children }, send] = useMachine(appMachine, {
    devTools: process.env.NODE_ENV == "development",
  });

  return (
    <StrictMode>
      <Global styles={appStyles} />
      <Suspense fallback={<div>SOME FALLBACK UI AND LOGIC</div>}>
        {matches("landing") && <Landing send={send} />}
        {matches("home") && (
          <div>
            Home
            <button onClick={() => void send("NAVIGATE_LANDING")}>back</button>
          </div>
        )}
        {matches("network") && (
          <div>
            Network
            <button onClick={() => void send("NAVIGATE_LANDING")}>back</button>
          </div>
        )}
      </Suspense>
    </StrictMode>
  );
};
