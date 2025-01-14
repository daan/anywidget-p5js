import p5 from "https://esm.sh/p5";

function render({ model, el }) {
    // create the p5canvas as a child of the element (el)
    let canvas = document.createElement("canvas");
    canvas.classList.add("p5canvas");
    el.appendChild(canvas);

    let x = 0;
    let y = 0;
    let angle = 0;

    let sketch = new p5((p) => {
        p.setup = () => {
            let p5canvas = p.createCanvas(800, 400, canvas);
            x = p.width / 2;
            y = p.height / 2;
            p5canvas.fill(255);
        };
        p.draw = () => {
            p.background('#eeffff');
            p.translate(x, y);
            p.rotate(angle);
            p.line(-60, 0, 60, 0);
            p.circle(60, 0, 16);
            p.circle(-60, 0, 16, 16);
            angle = angle + model.get("speed");
        }
        p.mousePressed = () => {
            // only respond to mouse press on the widget canvas
            if (p.mouseX < 0 || p.mouseY < 0 || p.mouseX > p.width || p.mouseY > p.height) return;
            x = p.mouseX;
            y = p.mouseY;

        }
    });
}

export default { render };