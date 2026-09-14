import type p5 from "p5";

export const wavemakerSketch = (p: p5) => {
	let t = 0;

	p.setup = () => {
		const parent = p.canvas?.parentElement;
		const w = parent ? parent.clientWidth : 600;
		const h = parent ? parent.clientHeight : 600;
		p.createCanvas(w, h);
		p.noStroke();
	};

	p.draw = () => {
		p.background(15, 15, 25, 40);
		p.fill("#ed225d");

		const step = Math.max(18, Math.min(p.width, p.height) / 18);
		const mx = p.mouseX > 0 && p.mouseX < p.width ? p.mouseX : p.width / 2;
		const my = p.mouseY > 0 && p.mouseY < p.height ? p.mouseY : p.height / 2;

		const xAngle = p.map(mx, 0, p.width, -4 * p.PI, 4 * p.PI, true);
		const yAngle = p.map(my, 0, p.height, -4 * p.PI, 4 * p.PI, true);

		for (let x = 0; x <= p.width; x += step) {
			for (let y = 0; y <= p.height; y += step) {
				const angle = xAngle * (x / p.width) + yAngle * (y / p.height);
				const radius = step * 0.65;
				const myX = x + radius * p.cos(2 * p.PI * t + angle);
				const myY = y + radius * p.sin(2 * p.PI * t + angle);
				p.ellipse(myX, myY, step * 0.25);
			}
		}

		t += 0.005;
	};

	p.windowResized = () => {
		const parent = p.canvas?.parentElement;
		if (parent) {
			p.resizeCanvas(parent.clientWidth, parent.clientHeight);
		}
	};
};
