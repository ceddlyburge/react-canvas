import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  Over,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Canvas } from "./Canvas";
import { Addable } from "./Addable";
import { useState } from "react";
import { Coordinates, Translate, ClientRect } from "@dnd-kit/core/dist/types";

const fridgePoetryWords = [
  "walk",
  "time",
  "it",
  "and",
  "of",
  "very",
  "wish",
  "run",
  "person",
  "I",
  "that",
  "in",
  "quite",
  "ed",
  "play",
  "year",
  "you",
  "but",
  "to",
  "rather",
  "ing",
  "read",
  "way",
  "he",
  "or",
  "for",
  "the",
  "er",
  "learn",
  "day",
  "they",
  "as",
  "with",
  "more",
  "dog",
  "be",
  "thing",
  "we",
  "if",
  "on",
  "most",
  "cat",
  "have",
  "man",
  "she",
  "when",
  "at",
  "less",
  "mom",
  "do",
  "who",
  "than",
  "from",
  "least",
  "dad",
  "say",
  "life",
  "them",
  "because",
  "by",
  "too",
  "the",
  "get",
  "hand",
  "me",
  "while",
  "about",
  "so",
  "grandma",
  "make",
  "part",
  "him",
  "where",
  "as",
  "just",
  "aunt",
  "go",
  "child",
  "one",
  "after",
  "into",
  "enough",
  "uncle",
  "know",
  "eye",
  "her",
  "so",
  "like",
  "indeed",
  "seem",
  "take",
  "woman",
  "us",
  "though",
  "through",
  "still",
  "feel",
  "see",
  "place",
  "something",
  "since",
  "after",
  "almost",
  "try",
  "come",
  "work",
  "nothing",
  "until",
  "over",
  "fairly",
  "leave",
  "think",
  "week",
  "anything",
  "whether",
  "between",
  "really",
  "call",
  "look",
  "case",
  "himself",
  "before",
  "out",
  "pretty",
  "ride",
  "want",
  "point",
  "everything",
  "although",
  "against",
  "even",
  "love",
  "give",
  "grandpa",
  "someone",
  "nor",
  "during",
  "a",
  "bit",
  "sort",
  "of",
  "use",
  "number",
  "themselves",
  "like",
  "without",
  "a",
  "little",
  "is",
  "find",
  "group",
  "everyone",
  "once",
  "before",
  "a",
  "lot",
  "was",
  "tell",
  "problem",
  "itself",
  "unless",
  "under",
  "were",
  "and",
  "ask",
  "fact",
  "anyone",
  "now",
  "around",
  "and",
  "school",
  "can",
  "could",
  "would",
  "will",
  "I",
  "food",
  "love",
];

export type Card = {
  id: UniqueIdentifier;
  pixelCoordinates: Coordinates;
  text: string;
};

// const calculateGridPosition = (
//   initialRect: DOMRect,
//   over: Over,
//   delta: Translate
// ): Coordinates =>
//   scaleCoordinates(
//     {
//       x: initialRect.x + delta.x - (over?.rect?.left ?? 0) - transform.x,
//       y: initialRect.y + delta.y - (over?.rect?.top ?? 0) - transform.y,
//     },
//     transform.k
//   );

const calculateCanvasPosition = (
  initialRect: ClientRect,
  over: Over,
  delta: Translate
): Coordinates => ({
  x: initialRect.left + delta.x - (over?.rect?.left ?? 0),
  y: initialRect.top + delta.y - (over?.rect?.top ?? 0),
});

export const TrayAndCanvas = () => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const [cards, setCards] = useState<Card[]>([
    { id: "Hello", pixelCoordinates: { x: 0, y: 0 }, text: "Hello" },
    { id: "world", pixelCoordinates: { x: 100, y: 100 }, text: "world" },
    { id: ".", pixelCoordinates: { x: 50, y: 50 }, text: "." },
  ]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ over, active, delta }: DragEndEvent) => {
    setActiveId(null);

    if (over?.id !== "canvas") return;
    if (!active.rect.current.initial) return;

    setCards([
      ...cards,
      {
        id: active.id,
        pixelCoordinates: calculateCanvasPosition(
          active.rect.current.initial,
          over,
          delta
        ),
        text: active.id.toString(),
      },
    ]);
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
      // collisionDetection={customCollisionDetectionStrategy()}
    >
      <div className="tray">
        {fridgePoetryWords.map((word) => (
          <Addable id={word} key={word}>
            <div className="trayCard">{word}</div>
          </Addable>
        ))}
      </div>
      <Canvas cards={cards} setCards={setCards}></Canvas>
      <DragOverlay dropAnimation={{ duration: 0, easing: "ease" }}>
        <div className="trayOverlayCard">{activeId}</div>
      </DragOverlay>
    </DndContext>
  );
};
