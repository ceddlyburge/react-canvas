import "./App.css";
import { Canvas } from "./Canvas";

function App() {
  return (
    <>
      <h1>React Canvas</h1>
      <Canvas>
        <div
          style={{
            position: "absolute",
            transformOrigin: "top left",
            top: "10px",
            left: "10px",
            backgroundColor: "red",
          }}
        >
          Hard coded card
        </div>
      </Canvas>
    </>
  );
}

export default App;
