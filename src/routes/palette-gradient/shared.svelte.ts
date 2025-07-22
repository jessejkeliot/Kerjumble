export const palette: paletteState = $state({
    colours: [],
    numberOfColours: 5,
    differenceOfColour: 30,
})

type paletteState = {
    colours: string[];
    numberOfColours: number;
    differenceOfColour: number;
}

export const settings = $state({
    numberOfColours: 5,
    differenceOfColour: 30,
    Algorithm: "histogram"
});