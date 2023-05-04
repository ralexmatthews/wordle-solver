import * as React from "react";
import { GetStaticProps } from "next";
import Letter from "@/components/letter";
import LetterInput from "@/components/letter_input";
import { wordle } from "@/utils/wordle";
import { Color, Letter as LetterType, Word } from "@/utils/types";
import Head from "next/head";

type Props = {
  words: string[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const words = await wordle([]);
    return {
      props: { words },
    };
  } catch {
    return {
      props: { words: [] },
    };
  }
};

const defaultInput: Word = [
  { color: Color.Black, letter: "a" },
  { color: Color.Black, letter: "a" },
  { color: Color.Black, letter: "a" },
  { color: Color.Black, letter: "a" },
  { color: Color.Black, letter: "a" },
];

const Home = ({ words: suppliedWords }: Props) => {
  const [state, setState] = React.useState<Word[]>([]);
  const [words, setWords] = React.useState(suppliedWords);
  const [input, setInput] = React.useState<Word>(defaultInput);
  const secondRef = React.useRef<HTMLInputElement>(null);
  const thirdRef = React.useRef<HTMLInputElement>(null);
  const fourthRef = React.useRef<HTMLInputElement>(null);
  const fifthRef = React.useRef<HTMLInputElement>(null);

  const fetchNewWords = async () => {
    const response = await fetch("/api/get_words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    }).then((res) => res.json());

    setWords(response.words);
  };

  const hasBeenSolved =
    state.length > 0 &&
    state[state.length - 1].every((letter) => letter.color === Color.Green);
  const hasBeenFailed = state.length >= 6 && !hasBeenSolved;

  React.useEffect(() => {
    if (state.length === 0 || hasBeenSolved) {
      return;
    }

    fetchNewWords();
  }, [state]);

  const updateInput = (i: number, letter: Partial<LetterType>) => {
    const newInput: Word = [...input];
    newInput[i] = { ...newInput[i], ...letter };
    setInput(newInput);
  };

  return (
    <>
      <Head>
        <title>Wordle Solver</title>
        <meta
          name="description"
          content="Solve your Wordle puzzle, the easy way"
        />
      </Head>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl m-4">Wordle Solver</h1>
        <a
          className="m-4"
          href="https://github.com/amatthews4851/wordle-solver"
        >
          GitHub
        </a>
      </div>
      <div className="w-full flex flex-col justify-center items-center mt-16">
        <div className="max-w-[324px]">
          <div>
            {state.map((word, i) => (
              <div
                key={i}
                className="flex flex-row justify-center items-center"
              >
                {word.map((letter, j) => (
                  <Letter key={j} {...letter} />
                ))}
              </div>
            ))}
          </div>
          {hasBeenFailed ? (
            <h2 className="text-2xl text-center mt-4">
              I have failed you. I'm sorry.
            </h2>
          ) : hasBeenSolved ? (
            <h2 className="text-2xl text-center mt-4">Congrats!</h2>
          ) : (
            <div>
              <h2 className="text-2xl mt-4">Next Word</h2>
              <p className="text-sm mb-4">
                Type or select the word you entered and select what each
                letter's color was, and then press submit.
              </p>
              <div className="flex flex-row justify-center items-center">
                <LetterInput
                  letter={input[0].letter}
                  onLetterChange={(letter) => {
                    updateInput(0, { letter });
                    secondRef.current?.focus();
                  }}
                  color={input[0].color}
                  onColorChange={(color) => updateInput(0, { color })}
                />
                <LetterInput
                  ref={secondRef}
                  letter={input[1].letter}
                  onLetterChange={(letter) => {
                    updateInput(1, { letter });
                    thirdRef.current?.focus();
                  }}
                  color={input[1].color}
                  onColorChange={(color) => updateInput(1, { color })}
                />
                <LetterInput
                  ref={thirdRef}
                  letter={input[2].letter}
                  onLetterChange={(letter) => {
                    updateInput(2, { letter });
                    fourthRef.current?.focus();
                  }}
                  color={input[2].color}
                  onColorChange={(color) => updateInput(2, { color })}
                />
                <LetterInput
                  ref={fourthRef}
                  letter={input[3].letter}
                  onLetterChange={(letter) => {
                    updateInput(3, { letter });
                    fifthRef.current?.focus();
                  }}
                  color={input[3].color}
                  onColorChange={(color) => updateInput(3, { color })}
                />
                <LetterInput
                  ref={fifthRef}
                  letter={input[4].letter}
                  onLetterChange={(letter) => updateInput(4, { letter })}
                  color={input[4].color}
                  onColorChange={(color) => updateInput(4, { color })}
                />
              </div>
              <button
                className="w-full bg-green-500 text-white rounded-lg my-4 p-2 hover:shadow"
                onClick={() => {
                  setState([...state, input]);
                  const nextInput = defaultInput.map(
                    (word, index): LetterType => {
                      if (input[index].color === Color.Green) {
                        return input[index];
                      } else {
                        return word;
                      }
                    }
                  ) as Word;
                  setInput(nextInput);
                }}
              >
                Submit
              </button>
              <div>
                <h2>Suggested Words</h2>
                <div className="space-x-1 space-y-1 w-full flex flex-row justify-center items-center flex-wrap">
                  {words.map((word) => (
                    <button
                      key={word}
                      className="px-4 py-2 rounded-xl bg-blue-500 text-white"
                      onClick={() =>
                        setInput([
                          { color: input[0].color, letter: word[0] },
                          { color: input[1].color, letter: word[1] },
                          { color: input[2].color, letter: word[2] },
                          { color: input[3].color, letter: word[3] },
                          { color: input[4].color, letter: word[4] },
                        ])
                      }
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
