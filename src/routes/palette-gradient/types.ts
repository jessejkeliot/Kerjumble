export type paletteState = {
    colours: string[];
    settings: paletteSettings;
}

export type paletteSettings = {
    numberOfColours: number;
    differenceOfColour: number;
    Algorithm: string;
    downsampleRate?: number;
};
export type colour = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};