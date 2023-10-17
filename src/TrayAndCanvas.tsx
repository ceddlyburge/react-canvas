import {
  DndContext,
  DragEndEvent,
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
import { ZoomTransform, zoomIdentity } from "d3-zoom";

const fridgePoetryWords = [
  "walk",
  "time",
  "it",
  "and",
  "very",
  "wish",
  "run",
  "person",
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
  "bit",
  "sort",
  "of",
  "use",
  "number",
  "themselves",
  "like",
  "without",
  "little",
  "a",
  "is",
  "find",
  "group",
  "everyone",
  "once",
  "before",
  "lot",
  "was",
  "tell",
  "problem",
  "itself",
  "unless",
  "under",
  "were",
  "ask",
  "fact",
  "anyone",
  "now",
  "around",
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

const scaleCoordinates = (coords: Coordinates, scale: number): Coordinates => ({
  x: coords.x / scale,
  y: coords.y / scale,
});

const calculateCanvasPosition = (
  initialRect: ClientRect,
  over: Over,
  delta: Translate,
  transform: ZoomTransform
): Coordinates =>
  scaleCoordinates(
    {
      x: initialRect.left + delta.x - (over?.rect?.left ?? 0) - transform.x,
      y: initialRect.top + delta.y - (over?.rect?.top ?? 0) - transform.y,
    },
    transform.k
  );

// this works when there is no pan / zoom for the canvas
// const calculateCanvasPosition = (
//   initialRect: ClientRect,
//   over: Over,
//   delta: Translate
// ): Coordinates => ({
//   x: initialRect.left + delta.x - (over?.rect?.left ?? 0),
//   y: initialRect.top + delta.y - (over?.rect?.top ?? 0),
// });

export const TrayAndCanvas = () => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const pointerSensor = useSensor(PointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // store the current transform from d3
  const [transform, setTransform] = useState(zoomIdentity);

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
          delta,
          transform
        ),
        text: active.id.toString(),
      },
    ]);
  };

  /* This DndContext is for dragging onto the canvas */
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart} // store the active card in state
      onDragEnd={handleDragEnd} // add the active card to the canvas
    >
      <div className="tray">
        {fridgePoetryWords.map((word) => {
          if (cards.find((card) => card.id === word)) return null;

          return (
            <Addable id={word}>
              <div className="trayCard">{word}</div>
            </Addable>
          );
        })}
      </div>

      <Canvas
        cards={cards}
        setCards={setCards}
        transform={transform}
        setTransform={setTransform}
      ></Canvas>

      <DragOverlay>
        <div className="trayOverlayCard">{activeId}</div>
      </DragOverlay>
    </DndContext>
  );
};
