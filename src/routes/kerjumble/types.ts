import { browser } from "$app/environment";
import { cubicInOut } from "svelte/easing";

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

export interface localStats {
  games: gameState[];
  meanAverageFinalHealth: number;
  streak: number;
}

interface globalStats {
  dayStats: dayStat[];

}
interface dayStat {
  numberOfPlayers: number;
  finalHealthList: number[];
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
  primary_color:  string; //health bar, outlines, dividers
  secondary_color: string; //used for color of buttons and selects
  type_color: string;
  background_color: string;
}

export function getItemFromLocalStorage(name: string) {
  if (!browser) {
    return null;
  }
  const returnString = localStorage.getItem(name);
  if (returnString) {
    console.log("Got ", name, "from local Storage");
    try {
      var returnvalue = JSON.parse(returnString);
    } catch (error) {
      console.log("Cannot Parse " + name  + " from local storage.");
    }
    
  } else {
    console.log("Failed to get ", name, "from local Storage");
    return undefined;
  }
  return returnvalue;
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
const classicTheme: theme = {
  name: "Classic",
  text_color: "#001",
  primary_color: "#001",
  secondary_color: "#EEE",
  type_color: "#666",
  background_color: "#FFF"
}

const partyTheme: theme = {
  name: "Party",
  text_color: "#FFF",
  primary_color: "#220B37",
  secondary_color: '#505CAA',
  type_color: "#999",
  background_color: "#335089"
}
const emeraldTheme: theme = {
  name: "Emerald",
  text_color: "#14140A",
  primary_color:"#ECC237",
  secondary_color:"#38BA73",
  type_color:"#AEA0A",
  background_color: "#FCF7EB",
}

const nileTheme: theme = {
  name: "Nile",
  text_color: "#FFF",
  primary_color:"#FF6101",
  secondary_color:"#222F3E",
  type_color:"#E6E6E6",
  background_color: "#131921",
}
const meanTheme: theme = {
  name: "Mean",
  text_color: "#F1F4F4",
  primary_color:"#3E1D3B",
  secondary_color:"#921C4C",
  type_color:"#423A3C",
  background_color: "#131312",
}

const leopardTheme: theme = {
  name: "Leopard",
  text_color: "#0A0907",
  primary_color:"#0A0907",
  secondary_color:"#9E3D32",
  type_color:"#AE7845",
  background_color: "#E3A84F",
}


export const themes : theme[] = [classicTheme, partyTheme, emeraldTheme, nileTheme, meanTheme];

export function setTheme(t: theme){ //NOW make this correspond to the things.
  console.log("Setting theme to ",  t.name, t);
  const root = document.documentElement;
  root.style.setProperty('--background-color', t.background_color);
  root.style.setProperty('--text-color', t.text_color);
  root.style.setProperty('--primary-color', t.primary_color);
  root.style.setProperty('--secondary-color', t.secondary_color);
  root.style.setProperty('--type-color', t.type_color);
}

export const defaultSettingState: settingState = {
    sound: false, music: false, theme:classicTheme, wordset:"easy"
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
function normalize(min: number, max:number) {
  var delta = max - min;
  return function (val: number) {
      return (val - min) / delta;
  };
}

export function shrinkFlex2(node: Element, { duration = 2500 } = {}) {
  const style = getComputedStyle(node);
  const initialFlex = parseFloat(style.flexGrow);
  const endOutlineColour = "black";
  const startOutlineColour = "white";
  // if (won) {
  //   return {};
  // }
  return {
    duration,
    css: (t: number) => {
      const eased = cubicInOut(t);
      let easedOpacity = 1;
      if (t < 0.5) {
        easedOpacity = t;
      }
      const flex = eased * initialFlex;
      return `flex-grow: ${eased * initialFlex};
      opacity: ${easedOpacity};
      `;
    },
  };
}

export function shrinkFlex(node: Element, { duration = 700 } = {}) {
  const style = getComputedStyle(node);
  const initialFlex = parseFloat(style.flexGrow);

  return {
    duration,
    css: (t: number) => {
      const eased = cubicInOut(t); // t goes from 1 → 0 during out transition
      const flex = eased * initialFlex;

      const progress = 1 - t; // 0 → 1 during out transition
      let opacity = 1;

      if (progress > 0.75) {
        opacity = 1 - ((progress - 0.75) / 0.25); // fade from 1 → 0 in last 25%
      }

      return `
        flex-grow: ${flex};
        opacity: ${opacity};
      `;
    },
  };
}
