import axios from 'axios';

export default class Buttons {
    constructor(container, canvas) {
        this.container = container;
        this.canvas = canvas;
        this.container.querySelector("#edit_button").addEventListener("change", () => {
            canvas.setEditMode();
        });
        this.container.querySelector("#draw_button").addEventListener("change", () => {
            canvas.setDrawingMode();
        });
        this.container.querySelector("#text_button").addEventListener("change", () => {
            canvas.setTextMode(() => {
                this.setActiveMode("edit");
            });
        });
        this.container.querySelector("#file_button").addEventListener("change", () => {
            this.addImage();
        });
        this.container.querySelector("#upload_button").addEventListener("click", () => {
            this.uploadImage();
        });
    }


    setActiveMode(mode) {
        let btn = this.container.querySelector(`input[value=${mode}]`);
        btn.checked=true; 
    }

    addImage() {
        const input = this.container.querySelector("#file_button");
        const file = input.files[0];
        const fr = new FileReader();
        fr.onload = () => {
            const img = new Image();
            img.onload = () => {
                this.canvas.addImage(img, () => {
                    input.value = null;
                    this.setActiveMode("edit");
                });
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(file);
    }

    uploadImage() {
        const screenField = this.container.querySelector("#screen_field");
        const screenId = screenField.value;
        const canvasData = this.canvas.toDataURL();
        axios.post(`/send/${screenId}`, { data: canvasData }).then(() => {
            this.canvas.clear();
        });
    }
}
