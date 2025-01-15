import p5 from "https://esm.sh/p5";

function render({ model, el }) {
    let time = () => model.get("time");
    let _stop_event = false;

    let isPlaying = false;
    let videoLoaded = false;

    let videoWidth;
    let videoHeight;
    let videoDuration;


    let x = 40;
    let y = 40;

    let video = document.createElement("video");
    video.classList.add("p5video");
    video.setAttribute("type", "video/mp4");
    video.setAttribute("src", "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    video.setAttribute("nocontrols", true);
    video.setAttribute("muted", true);
    video.addEventListener("timeupdate", () => {
        if (isPlaying) {
            _stop_event = true;
            model.set("time", video.currentTime);
            model.save_changes();
            _stop_event = false;
        } // console.log(video.currentTime);
    });
    video.addEventListener("play", (event) => {
        isPlaying = true;
    });
    video.addEventListener("pause", (event) => {
        isPlaying = false;
    });


    // TODO: happens all the time, use another event. 
    video.addEventListener("canplay", (event) => {
        videoLoaded = true;
        videoWidth = video.videoWidth;
        videoHeight = video.videoHeight;
        videoDuration = video.duration;
        model.set("duration", videoDuration);
        console.log("duration");
    });

    model.on("change:time", () => {
        if (_stop_event) { return }
        video.currentTime = model.get("time");
    });

    model.on("change:play", () => {
        if (model.get("play")) {
            video.play();
        } else {
            video.pause();
        }
    });


    let canvas = document.createElement("canvas");
    canvas.classList.add("p5canvas");

    el.appendChild(video);
    el.appendChild(canvas);

    let vtop = 0;
    let vleft = 0;
    let vscale = 1;
    let videoAspect = 1;
    let elementAspect = 1;
    let elementWidth = 0;
    let elementHeight = 0;

    // respond to size changes
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    const ro = new ResizeObserver(entries => {
        console.log(video.scrollWidth, "wh", video.scrollHeight);
        sketch.resizeCanvas(video.scrollWidth, video.scrollHeight);

        elementWidth = video.scrollWidth;
        elementHeight = video.scrollHeight;
        videoAspect = videoWidth / videoHeight;
        elementAspect = elementWidth / elementHeight;

        vtop = 0;
        vleft = 0;
        vscale = 1;

        if (videoAspect > elementAspect) {
            vtop = (elementHeight - (elementWidth / videoAspect)) / 2;
            vscale = elementWidth / videoWidth;
        } else if (videoAspect < elementAspect) {
            vleft = (elementWidth - (elementHeight * videoAspect)) / 2;
            vscale = elementHeight / videoHeight;
        }
        console.log(vleft, vtop, vscale);
    });
    ro.observe(video);


    let sketch = new p5((p) => {
        p.setup = () => {
            let p5canvas = p.createCanvas(800, 400, canvas);
        };
        p.draw = () => {
            p.resetMatrix();
            p.clear();
            p.noFill();
            p.stroke(0, 128, 255);
            p.line(0, 0, p.width, p.height);
            p.line(p.width, 0, 0, p.height);
            p.rect(0, 0, p.width, p.height);

            p.circle(x, y, 30);

            p.fill(255, 255, 255)
            p.stroke(0);
            p.textSize(20);
            let t = p.nf(video.currentTime, 4, 2) + " (" + p.int(video.currentTime * 25) + ")";
            p.text(t, 10, 20);

            p.applyMatrix(vscale, 0, 0, vscale, vleft, vtop);


            p.stroke(255, 128, 0);
            p.noFill();
            p.line(0, 0, videoWidth, videoHeight);
            p.line(videoWidth, 0, 0, videoHeight);
            p.rect(0, 0, videoWidth, videoHeight);
        }

        p.mousePressed = () => {
            if (p.mouseX < 0 || p.mouseY < 0 || p.mouseX > p.width || p.mouseY > p.height) return;
            x = p.mouseX;
            y = p.mouseY;
        }
    });
}

export default { render };
