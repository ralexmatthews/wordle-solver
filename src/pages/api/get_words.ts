import type { NextApiRequest, NextApiResponse } from "next";
import { wordle } from "@/utils/wordle";
import { Color, Word } from "@/utils/types";

const isWordsArray = (body: any): body is Word[] =>
  Array.isArray(body) &&
  body.every(
    (word) =>
      Array.isArray(word) &&
      word.every(
        (letter) => typeof letter.letter === "string" && !!Color[letter.color]
      )
  );

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Invalid method" });
    return;
  }

  const { body } = req;

  if (!isWordsArray(body)) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const words = await wordle(body);

  res.status(200).json({ words });
};

export default handler;
