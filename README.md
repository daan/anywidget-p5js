# anywidget-p5js

A few examples of using [p5.js](https://p5js.org/) in [Jupyter Notebooks](https://jupyter.org/) or in [Holoviz Panel](https://panel.holoviz.org/) using [anywidget](https://anywidget.dev/).


```
pip install "anywidget"
```

# minimal example

[![colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/daan/anywidget-p5js/blob/44759e1e859f51b259fb5c766118f70c18bfec1b/minimal-example/minimal-example.ipynb)

```
import anywidget
import traitlets

class CounterWidget(anywidget.AnyWidget):
    _esm = """
        import p5 from "https://esm.sh/p5";
        function render({ model, el }) {
            let canvas = document.createElement("canvas");
            canvas.classList.add("p5canvas");
            el.appendChild(canvas);
        
            let x = 0; let y = 0;
            let sketch = new p5((p) => {
                p.setup = () => {
                    let p5canvas = p.createCanvas(200, 50, canvas);
                    x = p.width / 2;
                    y = p.height / 2;
                    p.background('#ea580c');
                }
                p.draw = () => {
                    p.circle(x, y, model.get("value"));
                }
                p.mousePressed = () => {
                    // only respond to mouse press on the widget canvas
                    if (p.mouseX < 0 || p.mouseY < 0 || p.mouseX > p.width || p.mouseY > p.height) return;
                    x = p.mouseX;
                    y = p.mouseY;
                    model.set("value", model.get("value") + 1);
                    model.save_changes();
                }
            });
        }
        export default { render };
    """
    _css = """
        .p5canvas { width: 100%; height: 100%; object-fit: contain; z-index: 2; display: block; }
    """
    value = traitlets.Int(0).tag(sync=True)

CounterWidget(value=10)
```
