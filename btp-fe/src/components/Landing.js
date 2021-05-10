import React, { Suspense } from "react";
import useFetchSuspense from "../utils/useFetchSuspense";

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
    <button onClick={() => void send("NAVIGATE_HOME")}>Home</button>
    <button onClick={() => void send("NAVIGATE_NETWORK")}>Network</button>
    <Suspense fallback={<div>Fetching data...</div>}>
      <BostonRoutes />
    </Suspense>
  </div>
);

export default Home;
