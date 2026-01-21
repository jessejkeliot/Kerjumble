export type paletteState = {
    colours:Map<string, number>
    settings: paletteSettings;
}

export type paletteSettings = {
    numberOfColours: number;
    differenceOfColour: number;
    Algorithm: string;
    downsampleRate: number;
};
export type colour = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export type shaderConfig = {
  name: string
  webcam?: boolean;
  keyboard?: boolean;
  mouse?: boolean
  uniforms: shaderUniform[];
};

type shaderUniform = "resolution" | "time" | "zoom" | "viewOffset" | "palette" | "mousePos";