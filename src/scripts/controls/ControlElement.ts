import { TableEvents } from "../enums/TableEvents.js";
import { ControlEvents } from "../enums/ControlEvents.js";

export class ControlElement {
    private readonly control: HTMLElement;
    private isMooving = false;

    constructor(className: string, content: string, action: () => void) {
        this.control = document.createElement('div');
        this.control.className = className;
        this.control.style.position = 'absolute';
        this.control.innerText = content;

        this.control.addEventListener(ControlEvents.POINTER_DOWN, e => e.preventDefault());
        this.control.addEventListener(ControlEvents.TRANSITION_START, () => this.isMooving = true);
        this.control.addEventListener(ControlEvents.TRANSITION_END, () => this.isMooving = false);
        this.control.addEventListener(TableEvents.POINTER_UP, () => {
            if (this.isMooving) {
                return;
            }
            action();
        });
        document.body.append(this.control);
    }

    public hide(): void {
        this.control.hidden = true;
    }

    public show(): void {
        this.control.hidden = false;
    }

    public setPosition(pageX: number, pageY: number): void {
        this.control.style.top = `${pageY}px`;
        this.control.style.left = `${pageX}px`;
    }

    public calcDimensions(): number {
        return Math.max(this.control.offsetWidth, this.control.offsetHeight);
    }

    public shiftRight(): void {        
        this.control.style.left = `${parseFloat(this.control.style.left) + 42}px`;
    }

    public shiftBottom(): void {
        this.control.style.top = `${parseFloat(this.control.style.top) + 42}px`;
    }
}