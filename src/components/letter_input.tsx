import * as React from "react";
import { Color } from "@/utils/types";

const colorClassFromColor = (color: Color) => {
  switch (color) {
    case Color.Green:
      return "bg-green-500";
    case Color.Yellow:
      return "bg-yellow-500";
    default:
      return "bg-black";
  }
};

const validLetters = new Set("abcdefghijklmnopqrstuvwxyz".split(""));

const LetterInput = React.forwardRef(
  (
    {
      letter,
      onLetterChange,
      color,
      onColorChange,
    }: {
      letter: string;
      onLetterChange: (letter: string) => void;
      color: Color;
      onColorChange: (color: Color) => void;
    },
    ref: React.ForwardedRef<HTMLInputElement>
  ) => (
    <div className="flex flex-col justify-center items-center">
      <div
        className={`m-[1px] font-bold w-16 h-16 flex flex-row justify-center items-center text-white text-2xl ${colorClassFromColor(
          color
        )}`}
      >
        <input
          ref={ref}
          className="w-full h-full text-center bg-transparent"
          value={letter.toUpperCase()}
          onKeyDown={(e) => {
            const letter = e.key.toLowerCase();

            if (!validLetters.has(letter)) {
              return;
            }

            onLetterChange(letter);
          }}
        />
      </div>
      <div className="flex flex-row justify-between items-center">
        <button
          className={`w-[1.3rem] h-[1.3rem] flex flex-row justify-center items-center text-white text-sm ${colorClassFromColor(
            Color.Black
          )}`}
          onClick={() => onColorChange(Color.Black)}
        >
          B
        </button>
        <button
          className={`w-[1.3rem] h-[1.3rem] flex flex-row justify-center items-center text-white text-sm ${colorClassFromColor(
            Color.Yellow
          )}`}
          onClick={() => onColorChange(Color.Yellow)}
        >
          Y
        </button>
        <button
          className={`w-[1.3rem] h-[1.3rem] flex flex-row justify-center items-center text-white text-sm ${colorClassFromColor(
            Color.Green
          )}`}
          onClick={() => onColorChange(Color.Green)}
        >
          G
        </button>
      </div>
    </div>
  )
);

export default LetterInput;
