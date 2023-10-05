import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Canvas, customCollisionDetectionStrategy } from "./Canvas";

export const TrayAndCanvas = () => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const handleDragStart = ({ active }: DragStartEvent) => {
    // const { card } = extractTrayCardInfo(active);
    // setActiveTrayItem({
    //   data: card,
    // });
  };

  const handleDragEnd = ({ over, active, delta }: DragEndEvent) => {
    // const { initialRect, card } = extractTrayCardInfo(active);
    // setTrayCardUnderlayGridCoordinates(null);
    // if (card.id === addFrameDraggableId) {
    //   if (isDraggingAddFrameButton && over) {
    //     const dropPosition = calculateGridPosition(initialRect, over, delta);
    //     if (
    //       getCollidingItems({ ...card, ...dropPosition }, boardItems).length ===
    //       0
    //     ) {
    //       addFrameFromDragDrop(calculateGridPosition(initialRect, over, delta));
    //     }
    //   } else {
    //     addFrameFromClick();
    //   }
    // } else if (over?.id === 'canvas') {
    //   const dropPosition = calculateGridPosition(initialRect, over, delta);
    //   if (
    //     getCollidingItems({ ...card, ...dropPosition }, boardItems).length === 0
    //   ) {
    //     card.addCardToBoard(dropPosition, card);
    //   }
    //   turnSelectOn();
    // }
    // setActiveTrayItem(null);
    // setIsDragging(false);
    // setCollidingBoardCardIds([]);
    // setIsDraggingAddFrameButton(false);
  };

  const handleDragMove = ({ over, active, delta }: DragMoveEvent) => {
    // const { initialRect, card } = extractTrayCardInfo(active);
    // setIsDragging(over?.id === 'canvas');
    // if (
    //   card.id === addFrameDraggableId &&
    //   distanceMoved(delta) > dragActivationDistance
    // ) {
    //   setIsDraggingAddFrameButton(true);
    // }
    // if (over?.id === 'canvas') {
    //   const gridPosition = calculateGridPosition(initialRect, over, delta);
    //   setTrayCardUnderlayGridCoordinates(gridPosition);
    //   setCollidingBoardCardIds(
    //     getCollidingIds({ ...card, ...gridPosition }, boardItems)
    //   );
    // }
  };

  /* This DndContext is for dragging onto the canvas */
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart} // stores the activeCard
      onDragMove={handleDragMove} // uses doCardsCollide (see "Cards should not overlap" later)
      onDragEnd={handleDragEnd} // uses calculateCanvasPosition, adds activeCard to children
      collisionDetection={customCollisionDetectionStrategy()}
    >
      <Canvas></Canvas>
    </DndContext>
  );
};
