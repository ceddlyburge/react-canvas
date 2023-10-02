import { select } from "d3-selection";
import { ZoomTransform, zoom, zoomIdentity } from "d3-zoom";
import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";

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
    <div ref={canvasRef}>
      <div
        style={{
          // apply the transform from d3
          transformOrigin: "top left",
          transform: `translate3d(${transform.x}, ${transform.y}, ${transform.k})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
