import {fabric} from "fabric";

export default class Canvas {
    constructor(element, width, height) {
        this.element = element;
        const canvas = new fabric.Canvas(element);
        canvas.setWidth(width);
        canvas.setHeight(height);
        this.canvas = canvas;
        this.textListenerAdded = false;
        this.setEditMode();
    }

    setEditMode(callback) {
        this.canvas.isDrawingMode = false;
        if(callback) {
            callback();
        }
    }

    setDrawingMode(callback) {
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush = new fabric['PencilBrush'](this.canvas);
        this.canvas.freeDrawingBrush.color = 'Black';
        this.canvas.freeDrawingBrush.width = 4;
        if(callback) {
            callback();
        }
    }

    setTextMode(callback) { 
        this.canvas.isDrawingMode = false;
        this.waitingTextArea = true;
        if(!this.textListenerAdded) {
            this.canvas.on("mouse:down", (e) => {
                if(this.waitingTextArea) {
                    const text = new fabric.IText('Double-click to edit me', {
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        fontSize: 18,
                        left: e.pointer.x,
                        top: e.pointer.y
                    });
                    this.canvas.add(text);
                    this.canvas.bringToFront(text);
                    this.canvas.renderAll();
                    if(callback) {
                        callback();
                    }
                }
                this.waitingTextArea = false;
            });
            this.textListenerAdded = true;
        }
    }

    addImage(img, callback) {
        const ratio = Math.min(1, Math.min(this.canvas.width / img.width, this.canvas.height / img.height));
        const xOffset = (this.canvas.width - ratio * img.width) / 2;
        const yOffset = (this.canvas.height - ratio * img.height) / 2;
        const fImg = new fabric.Image(img, {
            left: xOffset,
            top: yOffset
        });
        fImg.scale(ratio);
        fImg.filters.push(new fabric.Image.filters.BlackWhite());
        fImg.applyFilters();
        this.canvas.setBackgroundImage(fImg);
        this.canvas.renderAll();
        if(callback) {
            callback();
        }
    }

    toDataURL() {
        return this.canvas.toDataURL();
    }

    clear() {
        this.canvas.clear();
    }
}

