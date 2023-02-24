import fs from "fs";
import path from "path";

const originalWords = fs
  .readFileSync(path.join(__dirname, "../data/words.txt"), "utf8")
  .split("\n");
const commonWords = fs
  .readFileSync(path.join(__dirname, "../data/common_words.txt"), "utf8")
  .split("\n")
  .reverse();

const initState: { [letter: string]: number } = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .reduce((acc, letter) => ({ ...acc, [letter]: 0 }), {});

const getPopularityOfLettersAtIndex = (words: string[], index: number) =>
  Object.entries(
    words.reduce(
      (acc, word) => ({
        ...acc,
        [word[index]]: acc[word[index]] + 1,
      }),
      initState
    )
  )
    .sort((a, b) => a[1] - b[1])
    .map(([letter]) => letter);

const scoreWord = (word: string, popularities: string[][]) => {
  const [firstLetter, secondLetter, thirdLetter, fourthLetter, fifthLetter] =
    word.split("");

  const sumOfPopularities =
    popularities[0].indexOf(firstLetter) +
    popularities[1].indexOf(secondLetter) +
    popularities[2].indexOf(thirdLetter) +
    popularities[3].indexOf(fourthLetter) +
    popularities[4].indexOf(fifthLetter);

  const commonalityIndex = commonWords.indexOf(word);

  const hasDuplicateLetters = new Set(word.split("")).size < 5;

  return (
    sumOfPopularities +
    (commonalityIndex === -1 ? 1 : commonalityIndex * 5) +
    (hasDuplicateLetters ? 1 : 100)
  );
};

const orderWords = () => {
  const firstLetterPopularity = getPopularityOfLettersAtIndex(originalWords, 0);
  const secondLetterPopularity = getPopularityOfLettersAtIndex(
    originalWords,
    1
  );
  const thirdLetterPopularity = getPopularityOfLettersAtIndex(originalWords, 2);
  const fourthLetterPopularity = getPopularityOfLettersAtIndex(
    originalWords,
    3
  );
  const fifthLetterPopularity = getPopularityOfLettersAtIndex(originalWords, 4);

  const popularities = [
    firstLetterPopularity,
    secondLetterPopularity,
    thirdLetterPopularity,
    fourthLetterPopularity,
    fifthLetterPopularity,
  ];

  const orderedWords = originalWords
    .sort((a, b) => {
      const aScore = scoreWord(a, popularities);
      const bScore = scoreWord(b, popularities);

      return bScore - aScore;
    })
    .join("\n");

  fs.writeFileSync(
    path.join(__dirname, "../data/sorted_words.txt"),
    orderedWords
  );

  console.log("done");
};

orderWords();
