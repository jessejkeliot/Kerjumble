import { hexToColour } from "./colourfunctions";
import type { colour } from "../types/types";

export function sortBy(
  colours: Map<string, number>,
  func: (c: colour) => number
): Map<string, number> {
  return new Map(
    [...colours.entries()].sort((a, b) => {
      return func(hexToColour(a[0])) - func(hexToColour(b[0]));
    })
  );
}