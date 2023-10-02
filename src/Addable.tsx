import { useDraggable } from "@dnd-kit/core";
import { ReactNode, useState } from "react";

export const Addable = ({
  id,
  children,
}: {
  id: string;
  children?: ReactNode;
}) => {
  const [ref, setRef] = useState<Element | null>(null);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { initialRect: ref?.getBoundingClientRect() },
  });

  const updateInitialRectAndForwardRef = (element: HTMLDivElement | null) => {
    setRef(element);
    setNodeRef(element);
  };

  return (
    <div ref={updateInitialRectAndForwardRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
