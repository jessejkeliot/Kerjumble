import type p5 from "p5";

export const wavemakerSketch = (p: p5) => {
    let t = 0;
    let currentX = -1;
    let currentY = -1;
    const easeFactor = 0.05;

    p.setup = () => {
        const parent = p.canvas?.parentElement;
        const w = parent ? parent.clientWidth : 600;
        const h = parent ? parent.clientHeight : 600;
        p.createCanvas(w, h);
        currentX = w / 2;
        currentY = h / 2;
    };

    p.draw = () => {
        p.background(15, 15, 25, 40);

        if (currentX < 0) currentX = p.width / 2;
        if (currentY < 0) currentY = p.height / 2;

        const isInside = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;

        if (isInside) {
            // Smoothly glide towards the mouse position upon entering/moving
            const d = p.dist(currentX, currentY, p.mouseX, p.mouseY);
            if (d < 0.5) {
                currentX = p.mouseX;
                currentY = p.mouseY;
            } else {
                currentX = p.lerp(currentX, p.mouseX, easeFactor);
                currentY = p.lerp(currentY, p.mouseY, easeFactor);
            }
        }
        // When outside, currentX and currentY remain fixed at their last position

        // 1. Calculate maxD dynamically after canvas dimensions exist
        const maxD = Math.sqrt(Math.pow(p.width, 2) + Math.pow(p.height, 2));

        const step = Math.max(18, Math.min(p.width, p.height) / 18);

        const xAngle = p.map(currentX, 0, p.width, 1 * p.PI, 4 * p.PI, true);
        const yAngle = p.map(currentY, 0, p.height, -1 * p.PI, 2 * p.PI, true);

        for (let x = 0; x <= p.width; x += step) {
            for (let y = 0; y <= p.height; y += step) {
                const angle = xAngle * (x / p.width) + yAngle * (y / p.height);
                const radius = step * 0.65;
                const myX = x + radius * p.cos(2 * p.PI * t + angle);
                const myY = y + radius * p.sin(2 * p.PI * t + angle);
                
                const pythag = Math.sqrt(p.pow((myX - currentX), 2) + p.pow((myY - currentY), 2));
                
                // 2. Invert mapping: 0 distance = 255 (bright), maxD = 30 (dim baseline)
                const alpha = p.map(pythag, 0, maxD, 255, 0);
                const strokeW = p.map(pythag, 0, maxD, 4, 55);

                // 3. Apply stroke with alpha channel
                p.stroke(237, 34, 93, alpha); // #ed225d in RGB + dynamic alpha
                p.strokeWeight(strokeW);
                p.point(myX, myY);
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