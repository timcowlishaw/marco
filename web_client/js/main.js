import Canvas from "./canvas";
import Buttons from "./buttons";
var initialized = false;
document.addEventListener("DOMContentLoaded",() => {
    if(!initialized) {
        initialized = true;
        const canvas = new Canvas(document.getElementById("canvas"), 400, 300);
        const buttons = new Buttons(document.getElementById("buttons"));
        buttons.bindToCanvas(canvas);
        console.log("loaded");
    }
});
