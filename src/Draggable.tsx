import { useDraggable } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { ReactNode } from "react";

export const Draggable = ({
  id,
  pixelCoordinates,
  // k,
  children,
}: {
  id: string;
  pixelCoordinates: Coordinates;
  // k,
  children?: ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { pixelCoordinates, id },
  });

  return (
    <div
      // position of card on canvas
      style={{
        position: "absolute",
        transformOrigin: "top left",
        top: `${pixelCoordinates.y}px`,
        left: `${pixelCoordinates.x}px`,
        // temporary change to this position when dragging
        ...(transform
          ? { transform: `translate3d(${transform.x}, ${transform.y}, 0)` }
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
