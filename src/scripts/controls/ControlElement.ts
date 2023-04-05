export class ControlElement {
    private readonly control: HTMLElement;
    private isMooving = false;

    constructor(className: string, content: string, action: () => void) {
        this.control = document.createElement('div');
        this.control.className = className;
        this.control.style.position = 'absolute';
        this.control.innerText = content;

        this.control.addEventListener('pointerdown', e => e.preventDefault());
        this.control.addEventListener('transitionstart', () => this.isMooving = true);
        this.control.addEventListener('transitionend', () => this.isMooving = false);
        this.control.addEventListener('pointerup', () => {
            if (this.isMooving) {
                return;
            }
            action();
            document.dispatchEvent(new CustomEvent('controlPressed'));
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
}