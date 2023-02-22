export enum Color {
  Black,
  Yellow,
  Green,
}

export type Letter = {
  letter: string;
  color: Color;
};

export type Word = [Letter, Letter, Letter, Letter, Letter];
