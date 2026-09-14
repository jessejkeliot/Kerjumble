import type p5 from "p5";
import { fireSketch } from "./fire/fireSketch";
import { fireBlusteredSketch } from "./fire-blustered/fireBlusteredSketch";
import { wavemakerSketch } from "./wavemaker/wavemakerSketch";
import { organiclinesSketch } from "./organiclines/organiclinesSketch";

export interface SketchItem {
	id: string;
	title: string;
	route: string;
	sketch: (p: p5) => void;
}

export const sketches: SketchItem[] = [
	{
		id: "fire",
		title: "Fire Shader",
		route: "/sketches/fire",
		sketch: fireSketch
	},
	{
		id: "wavemaker",
		title: "Wavemaker",
		route: "/sketches/wavemaker",
		sketch: wavemakerSketch
	},
	{
		id: "fire-blustered",
		title: "Fire Blustered",
		route: "/sketches/fire-blustered",
		sketch: fireBlusteredSketch
	},
	{
		id: "organiclines",
		title: "Organic Lines",
		route: "/sketches/organiclines",
		sketch: organiclinesSketch
	}
];

export { fireSketch, fireBlusteredSketch, wavemakerSketch, organiclinesSketch };
