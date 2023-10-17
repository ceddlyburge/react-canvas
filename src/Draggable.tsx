import { useDraggable } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { ZoomTransform } from "d3-zoom";
import { ReactNode } from "react";

export const Draggable = ({
  id,
  pixelCoordinates,
  children,
  canvasTransform,
}: {
  id: string;
  pixelCoordinates: Coordinates;
  children?: ReactNode;
  canvasTransform: ZoomTransform;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      className="card"
      // position of card on canvas
      style={{
        position: "absolute",
        transformOrigin: "top left",
        top: `${pixelCoordinates.y * canvasTransform.k}px`,
        left: `${pixelCoordinates.x * canvasTransform.k}px`,
        // temporary change to this position when dragging
        ...(transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${canvasTransform.k})`,
            }
          : { transform: `scale(${canvasTransform.k})` }),
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
