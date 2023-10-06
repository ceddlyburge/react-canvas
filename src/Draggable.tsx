import { useDraggable } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { ReactNode } from "react";

export const Draggable = ({
  id,
  pixelCoordinates,
  children,
}: {
  id: string;
  pixelCoordinates: Coordinates;
  children?: ReactNode;
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
        top: `${pixelCoordinates.y}px`,
        left: `${pixelCoordinates.x}px`,
        // temporary change to this position when dragging
        ...(transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0px)`,
            }
          : undefined),
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};
