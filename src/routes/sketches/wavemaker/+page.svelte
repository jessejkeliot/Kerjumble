<script lang="ts">
	import P5 from "p5-svelte";
	import type p5 from "p5"; // ✅ import the type

	const sketch = (p: p5) => {
		let t = 0;

		p.setup = () => {
			p.createCanvas(865, 400);
			p.noStroke();
			p.fill('#ed225d');
		};

		p.draw = () => {
			p.background(10, 10);

			for (let x = 0; x <= p.width; x += 30) {
				for (let y = 0; y <= p.height; y += 30) {
					const xAngle = p.map(p.mouseX, 0, p.width, -4 * p.PI, 4 * p.PI, true);
					const yAngle = p.map(p.mouseY, 0, p.height, -4 * p.PI, 4 * p.PI, true);
					const angle = xAngle * (x / p.width) + yAngle * (y / p.height);
					const myX = x + 20 * p.cos(2 * p.PI * t + angle);
					const myY = y + 20 * p.sin(2 * p.PI * t + angle);
					p.ellipse(myX, myY, 5);
				}
			}

			t += 0.005;
		};
	};
</script>

<P5 {sketch}/>
