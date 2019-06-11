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
        console.log("set mode");
        this.canvas.isDrawingMode = false;
        this.waitingTextArea = true;
        if(!this.textListenerAdded) {
            console.log("adding listener");
            this.canvas.on("mouse:down", (e) => {
                if(this.waitingTextArea) {
                    console.log("click");
                    this.canvas.add(new fabric.IText('Double-click to edit me', {
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        fontSize: 18,
                        left: e.pointer.x,
                        top: e.pointer.y
                    }));
                    if(callback) {
                        callback();
                    }
                }
                this.waitingTextArea = false;
            });
            this.textListenerAdded = true;
        }
    }
}

