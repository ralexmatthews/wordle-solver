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

const Letter = ({ letter, color }: { letter: string; color: Color }) => (
  <div
    className={`m-[1px] font-bold w-16 h-16 flex flex-row justify-center items-center text-white text-2xl ${colorClassFromColor(
      color
    )}`}
  >
    {letter.toUpperCase()}
  </div>
);

export default Letter;
