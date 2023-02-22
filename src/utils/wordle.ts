import fs from "fs";
import { promisify } from "util";
import path from "path";
import { Color, Word } from "./types";

const readFile = promisify(fs.readFile);

const getCommonWords = () =>
  readFile(
    path.join(process.cwd(), "./src/utils/common_words.txt"),
    "utf8"
  ).then((file) => file.split("\n"));
const getWords = () =>
  readFile(path.join(process.cwd(), "./src/utils/words.txt"), "utf8").then(
    (file) => file.split("\n")
  );

const getAvailableLettersForColumn = (
  column: number,
  words: Word[]
): string[] => {
  const letters = words.map((word) => word[column]);

  // if there is a green letter in this column, that is the only thing it can be
  const greenLetter = letters.find((letter) => letter.color === Color.Green);
  if (greenLetter) {
    return [greenLetter.letter];
  }

  const availableLetters = new Set("abcdefghijklmnopqrstuvwxyz".split(""));

  // if there is a yellow in the column, it cannot be that
  letters.forEach((letter) => {
    if (letter.color === Color.Yellow) {
      availableLetters.delete(letter.letter);
    }
  });

  // if there is a black in any of the words, it cannot be that either at this
  // point, since we already checked for yellows and greens
  words.flat().forEach((letter) => {
    if (letter.color === Color.Black) {
      availableLetters.delete(letter.letter);
    }
  });

  return [...availableLetters];
};

const deleteIndexOfArray = <T>(array: T[], index: number) =>
  array.slice(0, index).concat(array.slice(index + 1));

export const wordle = async (state: Word[]) => {
  const [commonWords, words] = await Promise.all([
    getCommonWords(),
    getWords(),
  ]);

  const availableLetters = [
    getAvailableLettersForColumn(0, state),
    getAvailableLettersForColumn(1, state),
    getAvailableLettersForColumn(2, state),
    getAvailableLettersForColumn(3, state),
    getAvailableLettersForColumn(4, state),
  ];

  const availableWords = [...new Set([...commonWords, ...words])]
    .filter(
      (word) =>
        availableLetters[0].includes(word[0]) &&
        availableLetters[1].includes(word[1]) &&
        availableLetters[2].includes(word[2]) &&
        availableLetters[3].includes(word[3]) &&
        availableLetters[4].includes(word[4])
    )
    .filter((word) => {
      const lettersThatNeedToBeInWord = [
        ...new Set(
          state
            .flat()
            .filter((letter) => letter.color !== Color.Black)
            .map((letter) => letter.letter)
        ),
      ];

      return lettersThatNeedToBeInWord.every((letter) => word.includes(letter));
    });

  return availableWords.slice(0, 10);
};
