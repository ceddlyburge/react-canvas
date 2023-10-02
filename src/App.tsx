import { DndContext } from "@dnd-kit/core";
import "./App.css";
import { Canvas, customCollisionDetectionStrategy } from "./Canvas";

function App() {
  return (
    <>
      <h1>React Canvas</h1>
      {/* This is for dragging around the canvas */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart} // stores the activeCard
        onDragMove={handleDragMove} // uses doCardsCollide (see "Cards should not overlap" later)
        onDragEnd={handleDragEnd} // uses calculateCanvasPosition, adds activeCard to children
        collisionDetection={customCollisionDetectionStrategy()}
      >
        <Canvas>
          {/* This is for dragging around the canvas */}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart} // stores the activeCard
            onDragMove={handleDragMove} // uses doCardsCollide (see "Cards should not overlap" later), updates pixelCoordinates
            onDragEnd={handleDragEnd} // updates position of activeCard
          >
            <div
              className="card"
              style={{
                top: "10px",
                left: "10px",
                backgroundColor: "red",
              }}
            >
              Hard coded card
            </div>
          </DndContext>
        </Canvas>
      </DndContext>
    </>
  );
}

export default App;
