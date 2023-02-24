import fs from "fs";
import path from "path";
import { wordle } from "@/utils/wordle";
import { Word, Color, Letter } from "@/utils/types";

const pastWordleWords = fs
  .readFileSync(path.join(__dirname, "../data/past_wordle_words.txt"), "utf8")
  .split("\n");

const getStateForWord = (word: string, suggestion: string): string => {
  const state = Array(5).fill("b");
  const wordLetters = word.split("");
  const suggestionLetters = suggestion.split("");

  suggestionLetters.forEach((letter, index) => {
    if (wordLetters[index] === letter) {
      state[index] = "g";
    }
  });

  suggestionLetters.forEach((letter, index) => {
    if (state[index] === "b" && wordLetters.includes(letter)) {
      const letterCountInWord = wordLetters.filter(
        (wordLetter) => wordLetter === letter
      ).length;
      const letterCountInSuggestion = suggestionLetters.filter(
        (suggestionLetter) => suggestionLetter === letter
      ).length;

      if (letterCountInWord === letterCountInSuggestion) {
        state[index] = "y";
        return;
      }

      // if this is the first occurrence of the letter in the suggestion that
      // should be yellow, then make it yellow. otherwise, make it black.
      const firstOccurrenceOfLetterInSuggestion = suggestionLetters.findIndex(
        (suggestionLetter) => suggestionLetter === letter
      );

      if (firstOccurrenceOfLetterInSuggestion === index) {
        state[index] = "y";
      }
    }
  });

  return state.join("");
};

const getNumberOfAttempts = async (
  word: string,
  state: Word[] = [],
  attempt = 1
): Promise<number> => {
  const result = await wordle(state);

  if (!result[0]) {
    console.log("No result for", word);
    return -1;
  }

  if (result[0] === word) {
    return attempt;
  }

  const stateForWord = getStateForWord(word, result[0])
    .split("")
    .map(
      (color, index): Letter => ({
        letter: result[0][index],
        color:
          color === "g"
            ? Color.Green
            : color === "y"
            ? Color.Yellow
            : Color.Black,
      })
    ) as Word;

  const newState = [...state, stateForWord];

  return getNumberOfAttempts(word, newState, attempt + 1);
};

const getNumberOfAttemptsForAllWords = async () => {
  const numberOfAttempts = await Promise.all(
    pastWordleWords.map((word) => getNumberOfAttempts(word))
  );

  const [completed, notCompleted] = numberOfAttempts.reduce(
    ([a, b], attempt) => {
      if (attempt === -1) {
        return [a, b + 1];
      } else {
        return [[...a, attempt], b];
      }
    },
    [[], 0] as [number[], number]
  );

  const average =
    completed.reduce((acc, attempt) => acc + attempt, 0) / completed.length;

  console.log(
    `Average number of attempts: ${average}\nIncomplete: ${notCompleted}`
  );
};

getNumberOfAttemptsForAllWords();
