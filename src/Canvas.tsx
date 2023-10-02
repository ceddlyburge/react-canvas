import {
  Active,
  CollisionDetection,
  DndContext,
  DroppableContainer,
  rectIntersection,
} from "@dnd-kit/core";
import { Over, RectMap } from "@dnd-kit/core/dist/store/types";
import { ClientRect, Coordinates, Translate } from "@dnd-kit/core/dist/types";
import { select } from "d3-selection";
import { ZoomTransform, zoom, zoomIdentity } from "d3-zoom";
import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";

// to scale droppabe things to canvas
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

export const Canvas = ({ children }: { children?: ReactNode }) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={canvasRef} style={{ backgroundColor: "gray" }}>
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
          onDragStart={handleDragStart} // stores the activeCard
          onDragMove={handleDragMove} // uses doCardsCollide (see "Cards should not overlap" later), updates pixelCoordinates
          onDragEnd={handleDragEnd} // updates position of activeCard
        >
          {children}
        </DndContext>
      </div>
    </div>
  );
};
