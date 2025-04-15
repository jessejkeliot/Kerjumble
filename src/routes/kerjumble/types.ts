export interface Question {
  word: string;
  type: "verb" | "adjective" | "noun" | "adverb";
  definitions: string[];
}

export interface gameState {
    number: number;
    currentInput: string;
    health: number;
    won: boolean;
}

export const getDaysDifferenceUTC = (startDate: string) => {
  const currentDate = new Date();
  const start = new Date(startDate);

  // Ensure both dates are in UTC for consistency
  const currentUTC = Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate()
  );
  const startUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate()
  );

  // Calculate the difference in milliseconds and convert to days
  const differenceInMillis = currentUTC - startUTC;
  const daysDifference = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));

  return daysDifference;
};
