import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MapWithDirections from "./MapsDirection";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Google Maps with Directions</h1>
        <MapWithDirections></MapWithDirections>
      </div>
    </>
  );
}

export default App;
