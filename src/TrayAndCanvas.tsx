import { DndContext } from "@dnd-kit/core";
import { Canvas, customCollisionDetectionStrategy } from "./Canvas";

export const TrayAndCanvas = () => {
  {
    /* This is for dragging onto the canvas */
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart} // stores the activeCard
      onDragMove={handleDragMove} // uses doCardsCollide (see "Cards should not overlap" later)
      onDragEnd={handleDragEnd} // uses calculateCanvasPosition, adds activeCard to children
      collisionDetection={customCollisionDetectionStrategy()}
    >
      <Canvas>
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
      </Canvas>
    </DndContext>
  );
};
