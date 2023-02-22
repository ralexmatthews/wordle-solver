# Wordle Solver

This can be played with at [alexs-wordle-solver.netlify.app](https://alexs-wordle-solver.netlify.app/).

This is a rudimentary implementation of a way to solve the New York Time's Wordle puzzle. It essentially supplies a list of educated guesses based on what has already been entered. It first tries to guess more common words, but falls back to a huge list of unordered words. The main algorithm lives in [src/utils/wordle.ts](src/utils/wordle.ts). This is used in both the [src/pages/api/get_words.ts](src/pages/api/get_words.ts) API endpoint and the [src/pages/index.tsx](src/pages/index.tsx) page on preload.
