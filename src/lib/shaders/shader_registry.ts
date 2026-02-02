import type { shaderConfig } from "$lib/types/types";

export const shaderRegistry: Record<string, shaderConfig> = {
    "2026-01-22": { name: "mandelbrot xplorer", keyboard: true, uniforms: ["palette", "resolution", "viewOffset", "zoom"] },
};
