import { Suspense } from "react";
import { css } from "@emotion/react";
import useFetchSuspense from "../utils/useFetchSuspense";
import Button from "./Button";

const customeCSSS = css`
  width: 150px;
  height: 100px;
  background-color: red;
`;

function BostonRoutes() {
  const data = useFetchSuspense("https://api-v3.mbta.com/routes", {
    query: { "filter[type]": "0,1" },
  });

  return (
    <ul>
      {data.data.map((route) => (
        <li key={route.id}>{route.attributes.long_name}</li>
      ))}
    </ul>
  );
}

const Home = ({ send }) => (
  <div>
    <h1>Welcome Landing</h1>
    <Button size="lg" type="primary" onClick={() => void send("NAVIGATE_HOME")}>
      Home
    </Button>
    <Button size="md" type="primary" onClick={() => void send("NAVIGATE_HOME")}>
      MD
    </Button>
    <Button size="sm" type="primary" onClick={() => void send("NAVIGATE_HOME")}>
      SM
    </Button>
    <Button customCss={customeCSSS}>customeCSSS</Button>
    <Button type="outline" onClick={() => void send("NAVIGATE_NETWORK")}>
      Network
    </Button>
    <Suspense fallback={<div>Fetching data...</div>}>
      <BostonRoutes />
    </Suspense>
  </div>
);

export default Home;
