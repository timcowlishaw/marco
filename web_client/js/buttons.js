export default class Buttons {
    constructor(container, canvas) {
        this.container = container;
        container.getElementById("edit_button").addEventListener("change", () => {
            canvas.setEditMode();
        });
        container.getElementById("draw_button").addEventListener("change", () => {
            canvas.setDrawingMode();
        });
        container.getElementById("text_button").addEventListener("change", () => {
            canvas.setTextMode(() => {
                buttons.setActiveMode("edit");
            });
        });
    }


    setActiveMode(mode) {
        let btn = this.container.querySelector(`input[value=${mode}]`);
        btn.checked=true; 
    }
}
