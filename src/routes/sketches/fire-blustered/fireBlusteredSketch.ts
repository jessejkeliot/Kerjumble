import type p5 from "p5";
import vertShader from "./basic.vert?raw";
import fragShader from "./basic.frag?raw";

export const fireBlusteredSketch = (p: p5) => {
	let simpleShader: p5.Shader;
	let paletteTexture: p5.Graphics;

	p.setup = () => {
		const parent = p.canvas?.parentElement;
		const w = parent ? parent.clientWidth : 600;
		const h = parent ? parent.clientHeight : 600;
		p.createCanvas(w, h, p.WEBGL);
		p.noStroke();

		simpleShader = p.createShader(vertShader, fragShader);

		const colors = [
			[0.235, 0.153, 0.549],
			[0.188, 0.125, 0.125],
			[0.992, 0.847, 0.4],
			[0.376, 0.427, 0.392],
			[0.0, 0.0, 0.0],
			[0.0, 0.0, 0.03]
		];

		paletteTexture = p.createGraphics(colors.length, 1);
		paletteTexture.noStroke();
		for (let i = 0; i < colors.length; i++) {
			paletteTexture.fill(colors[i][0] * 255, colors[i][1] * 255, colors[i][2] * 255);
			paletteTexture.rect(i, 0, 1, 1);
		}
	};

	p.draw = () => {
		if (!simpleShader) return;
		p.shader(simpleShader);
		simpleShader.setUniform("time", p.millis() / 1000);
		simpleShader.setUniform("resolution", [p.width, p.height]);
		simpleShader.setUniform("mousePos", [p.mouseX / p.width, p.mouseY / p.height]);
		simpleShader.setUniform("palette", paletteTexture);
		p.rect(0, 0, p.width, p.height);
	};

	p.windowResized = () => {
		const parent = p.canvas?.parentElement;
		if (parent) {
			p.resizeCanvas(parent.clientWidth, parent.clientHeight);
		}
	};
};
