import type p5 from "p5";

class NoiseLoop {
	diameter: number;
	min: number;
	max: number;
	cx: number;
	cy: number;
	p: p5;

	constructor(p: p5, diameter: number, min: number, max: number) {
		this.p = p;
		this.diameter = diameter;
		this.min = min;
		this.max = max;
		this.cx = p.random(1000);
		this.cy = p.random(1000);
	}

	value(a: number) {
		const xoff = this.p.map(this.p.cos(a), -1, 1, this.cx, this.cx + this.diameter);
		const yoff = this.p.map(this.p.sin(a), -1, 1, this.cy, this.cy + this.diameter);
		const r = this.p.noise(xoff, yoff);
		return this.p.map(r, 0, 1, this.min, this.max);
	}
}

export const organiclinesSketch = (p: p5) => {
	let loops: NoiseLoop[] = [];
	let angle = 0;

	p.setup = () => {
		const parent = p.canvas?.parentElement;
		const w = parent ? parent.clientWidth : 600;
		const h = parent ? parent.clientHeight : 600;
		p.createCanvas(w, h);
		p.colorMode(p.HSB, 360, 100, 100, 100);
		p.noFill();

		loops = [
			new NoiseLoop(p, 1.5, 50, 180),
			new NoiseLoop(p, 2.0, 30, 220),
			new NoiseLoop(p, 3.0, 20, 260),
			new NoiseLoop(p, 1.0, 80, 150)
		];
	};

	p.draw = () => {
		p.background(240, 20, 12, 18);
		p.translate(p.width / 2, p.height / 2);

		const scaleFactor = Math.min(p.width, p.height) / 500;
		p.scale(scaleFactor);

		const numRings = 12;
		for (let r = 0; r < numRings; r++) {
			const hue = (p.frameCount * 0.4 + r * 15) % 360;
			p.stroke(hue, 75, 90, 45);
			p.strokeWeight(1.5);

			p.beginShape();
			const totalPoints = 120;
			for (let i = 0; i <= totalPoints; i++) {
				const a = p.map(i, 0, totalPoints, 0, p.TWO_PI);
				const loopIndex = r % loops.length;
				const baseRad = loops[loopIndex].value(a + angle + r * 0.15);
				const rad = baseRad + r * 12;
				const x = rad * p.cos(a);
				const y = rad * p.sin(a);
				p.vertex(x, y);
			}
			p.endShape(p.CLOSE);
		}

		angle += 0.008;
	};

	p.windowResized = () => {
		const parent = p.canvas?.parentElement;
		if (parent) {
			p.resizeCanvas(parent.clientWidth, parent.clientHeight);
		}
	};
};
