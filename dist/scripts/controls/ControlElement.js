export class ControlElement {
    constructor(className, content, action) {
        this.isMooving = false;
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
        });
        document.body.append(this.control);
    }
    hide() {
        this.control.hidden = true;
    }
    show() {
        this.control.hidden = false;
    }
    setPosition(pageX, pageY) {
        this.control.style.top = `${pageY}px`;
        this.control.style.left = `${pageX}px`;
    }
    calcDimensions() {
        return Math.max(this.control.offsetWidth, this.control.offsetHeight);
    }
    shiftRight() {
        this.control.style.left = `${parseFloat(this.control.style.left) + 42}px`;
    }
    shiftBottom() {
        this.control.style.top = `${parseFloat(this.control.style.top) + 42}px`;
    }
}
