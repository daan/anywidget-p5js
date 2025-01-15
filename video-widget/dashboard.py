import panel as pn

pn.extension()

import anywidget

import pathlib
import traitlets
import ipywidgets
from ipywidgets import FloatSlider, Layout


class P5VideoWidget(anywidget.AnyWidget):
    _esm = pathlib.Path(".") / "video.js"
    _css = pathlib.Path(".") / "video.css"
    time = traitlets.Float(0).tag(sync=True)
    play = traitlets.Bool(False).tag(sync=True)
    duration = traitlets.Float(0).tag(sync=True)
    src = traitlets.Unicode(
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    ).tag(sync=True)


# video widget

p5vw = P5VideoWidget(layout=Layout(width="100%", height="100%"))


def duration_change(change):
    slider.end = change.new


p5vw.observe(duration_change, names="duration")


def time_change(change):
    slider.value = change.new


p5vw.observe(time_change, names="time")

# button

button = pn.widgets.Button(name="Play", width=50, height=50)


def start_stop(event):
    p5vw.play = not p5vw.play
    if p5vw.play:
        button.name = "Stop"
    else:
        button.name = "Play"


button.param.watch(start_stop, "clicks")

# slider

slider = pn.widgets.FloatSlider(
    name="time", start=0, end=800, step=0.01, height=200, sizing_mode="stretch_width"
)


def update_time_from_slider(event):
    p5vw.time = slider.value


slider.param.watch(update_time_from_slider, "value")


gspec = pn.GridSpec(sizing_mode="stretch_both")
gspec[0, :3] = p5vw
gspec[1, :3] = pn.Row(button, slider)
pn.panel(gspec).servable()
