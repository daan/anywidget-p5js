import panel as pn
import anywidget

import pathlib
import traitlets
import ipywidgets
from ipywidgets import FloatSlider


class P5Widget(anywidget.AnyWidget):
    _esm = pathlib.Path(".") / "p5w.js"
    _css = pathlib.Path(".") / "p5w.css"
    speed = traitlets.Float(0).tag(sync=True)


p5w = P5Widget()

slider = pn.widgets.FloatSlider(
    name="speed", start=0, end=0.5, step=0.01, height=200, width=800
)


def update(event):
    p5w.speed = slider.value


slider.param.watch(update, "value")

c = pn.Column(p5w, slider)
pn.panel(c).servable()
