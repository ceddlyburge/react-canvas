import {
  Active,
  CollisionDetection,
  DndContext,
  DroppableContainer,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Over, RectMap } from "@dnd-kit/core/dist/store/types";
import {
  ClientRect,
  Coordinates,
  DragEndEvent,
  Translate,
} from "@dnd-kit/core/dist/types";
import { select } from "d3-selection";
import { ZoomTransform, zoom, zoomIdentity } from "d3-zoom";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Draggable } from "./Draggable";
import { Card } from "./TrayAndCanvas";

// to scale droppable things to canvas
/* <div
    style{
        transformOrigin: 'top left',
        transform: `scale(${transform.k})`,
      }
></div> */

export const calculateCanvasPosition = (
  initialRect: DOMRect,
  over: Over,
  delta: Translate,
  transform: ZoomTransform
) =>
  scaleCoordinates(
    {
      x: initialRect.x + delta.x - (over?.rect?.left ?? 0) - transform.x,
      y: initialRect.y + delta.y - (over?.rect?.top ?? 0) - transform.y,
    },
    transform.k
  );

export const scaleCoordinates = (
  coords: Coordinates,
  scale: number
): Coordinates => ({
  x: coords.x / scale,
  y: coords.y / scale,
});

export const snapCoordinates = ({ x, y }: Coordinates): Coordinates => ({
  x: snapCoordinate(x, 10),
  y: snapCoordinate(y, 10),
});

const snapCoordinate = (value: number, gridSize: number) =>
  Math.round(value / gridSize) * gridSize;

export const customCollisionDetectionStrategy = (): CollisionDetection => {
  return ({
    active,
    collisionRect,
    droppableRects,
    droppableContainers,
    pointerCoordinates,
  }: {
    active: Active;
    collisionRect: ClientRect;
    droppableRects: RectMap;
    droppableContainers: DroppableContainer[];
    pointerCoordinates: Coordinates | null;
  }) => {
    if (active.rect.current.translated) {
      const targetScaled: ClientRect = {
        ...collisionRect,
        ...active.rect.current.translated,
      };

      const trayRect = droppableContainers.filter(
        (droppableContainer) => droppableContainer.id === "tray"
      );

      const intersectingTrayRect = rectIntersection({
        active,
        collisionRect: targetScaled,
        droppableRects,
        droppableContainers: trayRect,
        pointerCoordinates,
      });

      if (intersectingTrayRect.length > 0) {
        return intersectingTrayRect;
      }

      const otherRects = droppableContainers.filter(
        (droppableContainer) => droppableContainer.id !== "tray"
      );

      return rectIntersection({
        active,
        collisionRect: targetScaled,
        droppableRects,
        droppableContainers: otherRects,
        pointerCoordinates,
      });
    }

    return [];
  };
};

export const Canvas = ({
  cards,
  setCards,
}: {
  cards: Card[];
  setCards: (cards: Card[]) => void;
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  const updateAndForwardRef = (div: HTMLDivElement) => {
    canvasRef.current = div;
    // setCanvasElement(div);
    setNodeRef(div);
  };

  // store the current transform from d3
  const [transform, setTransform] = useState(zoomIdentity);

  // update the transform when d3 zoom notifies of a change
  const updateTransform = ({ transform }: { transform: ZoomTransform }) => {
    setTransform(transform);
  };

  // create the d3 zoom object, and useMemo to retain it for rerenders
  const zoomBehavior = useMemo(() => zoom<HTMLDivElement, unknown>(), []);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    // get transform changed notifications from d3 zoom
    zoomBehavior.on("zoom", updateTransform);

    // attach d3 zoom to the canvas div element, which will handle
    // mousewheel and drag events automatically for pan / zoom
    select<HTMLDivElement, unknown>(canvasRef.current).call(zoomBehavior);
  }, [zoomBehavior, canvasRef]);

  // animated Zoom In, which can be called from a button event (not shown in this example)
  // const zoomIn = () => {
  //     if (!canvasRef.current) return;

  //     select<HTMLDivElement, unknown>(canvasRef.current).transition().duration(500)?.call(zoomBehavior.scaleBy, 1.5);
  // };

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const handleDragEnd = ({ delta, active }: DragEndEvent) => {
    if (!delta.x && !delta.y) return;

    setCards(
      cards.map((card) => {
        if (card.id === active.id) {
          return {
            ...card,
            pixelCoordinates: {
              x: card.pixelCoordinates.x + delta.x,
              y: card.pixelCoordinates.y + delta.y,
            },
          };
        }
        return card;
      })
    );
  };

  return (
    <div ref={updateAndForwardRef} className="canvas">
      <div
        style={{
          // apply the transform from d3
          transformOrigin: "top left",
          transform: `translate3d(${transform.x}, ${transform.y}, ${transform.k})`,
          position: "relative",
          height: "300px",
        }}
      >
        {/* This is for dragging around the canvas */}
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd} // updates position of activeCard
        >
          {cards.map((card) => (
            <Draggable
              id={card.id.toString()}
              pixelCoordinates={card.pixelCoordinates}
              key={card.id}
            >
              {card.text}
            </Draggable>
          ))}
        </DndContext>
      </div>
    </div>
  );
};
