import { browser } from "$app/environment";

export interface Question {
  word: string;
  type: "verb" | "adjective" | "noun" | "adverb";
  definitions: string[];
}

export interface Definition {
  word: string;
  type: "verb" | "adjective" | "noun" | "adverb";
  definition: string;
}

export interface gameState {
    number: number;
    currentInput: string;
    health: number;
    won: boolean;
}

export interface settingState {
  sound: boolean; 
  music: boolean
  theme: theme;
  wordset: string;
}

export interface theme {
  name: string;
  text_color: string; 
  primary_color:  string;
  secondary_color: string;
  background_color: string;
}



export function saveState(
  name: string, object: any
) {
  // localStorage.clear();
  if (!browser) {
    return;
  }
  localStorage.setItem(name, JSON.stringify(object));
  console.log("saved ", object, "to localStorage: ", name);
}
export const lightTheme: theme = {
  name: "light",
  text_color: "#001",
  primary_color: "#001",
  background_color: "#FFF"
}

export const partyTheme: theme = {
  name: "party",
  text_color: "#FFF",
  primary_color: "#220B37",
  background_color: "#AA505C"
}

export const themes : theme[] = [lightTheme, partyTheme];

export const defaultSettingState: settingState = {
    sound: false, music: false, theme:lightTheme, wordset:"easy"
}

export function playSound(filename: string, bypass: boolean) {
  if (!browser) return;
  if (!bypass) return;

  const clickSound = new Audio("/sounds/" + filename);
  clickSound.volume = 0.4;
  clickSound.play();
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
