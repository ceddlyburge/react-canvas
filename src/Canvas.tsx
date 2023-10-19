import { DndContext, useDroppable } from "@dnd-kit/core";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import { select } from "d3-selection";
import { ZoomTransform, zoom } from "d3-zoom";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { Draggable } from "./Draggable";
import { Card } from "./TrayAndCanvas";

// to scale droppable things to canvas
/* <div
    style{
        transformOrigin: 'top left',
        transform: `scale(${transform.k})`,
      }
></div> */

export const Canvas = ({
  cards,
  setCards,
  transform,
  setTransform,
}: {
  cards: Card[];
  setCards: (cards: Card[]) => void;
  transform: ZoomTransform;
  setTransform(transform: ZoomTransform): void;
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  const updateAndForwardRef = (div: HTMLDivElement) => {
    canvasRef.current = div;
    setNodeRef(div);
  };

  // update the transform when d3 zoom notifies of a change
  const updateTransform = useCallback(
    ({ transform }: { transform: ZoomTransform }) => {
      setTransform(transform);
    },
    [setTransform]
  );

  // create the d3 zoom object, and useMemo to retain it for rerenders
  const zoomBehavior = useMemo(() => zoom<HTMLDivElement, unknown>(), []);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    // get transform changed notifications from d3 zoom
    zoomBehavior.on("zoom", updateTransform);

    // attach d3 zoom to the canvas div element, which will handle
    // mousewheel and drag events automatically for pan / zoom
    select<HTMLDivElement, unknown>(canvasRef.current).call(zoomBehavior);
  }, [zoomBehavior, canvasRef, updateTransform]);

  // animated Zoom In, which can be called from a button event (not shown in this example)
  const zoomIn = () => {
    if (!canvasRef.current) return;

    select<HTMLDivElement, unknown>(canvasRef.current)
      .transition()
      .duration(500)
      ?.call(zoomBehavior.scaleBy, 1.5);
  };

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
    <>
      <div>
        <button onClick={zoomIn}>Zoom In</button>
      </div>
      <div ref={updateAndForwardRef} className="canvasWindow">
        <div
          className="canvas"
          style={{
            // apply the transform from d3
            transformOrigin: "top left",
            transform: `translate3d(${transform.x}px, ${transform.y}px, ${transform.k}px)`,
            position: "relative",
            height: "300px",
          }}
        >
          {/* This is for dragging around the canvas */}
          <DndContext
            onDragEnd={handleDragEnd} // updates position of activeCard
          >
            {cards.map((card) => (
              <Draggable
                id={card.id.toString()}
                pixelCoordinates={card.pixelCoordinates}
                key={card.id}
                // scale the card to the canvas
                canvasTransform={transform}
              >
                {card.text}
              </Draggable>
            ))}
          </DndContext>
        </div>
      </div>
    </>
  );
};
