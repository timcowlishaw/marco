import Canvas from "./canvas";
import Buttons from "./buttons";
document.addEventListener("DOMContentLoaded",() => {
    const canvas = new Canvas(document.getElementById("canvas"), 400, 300);
    const buttons = new Buttons(document.getElementById("buttons"), canvas);
});
