class TableControl {
    constructor(className, content, action) {
        this.$control = document.createElement('div');
        this.$control.className = className;
        this.$control.style.position = 'absolute';
        this.$control.innerText = content;
        this.$control.addEventListener('mousedown', e => e.preventDefault());
        this.$control.addEventListener('mouseup', action);
        document.body.append(this.$control);
    }
    
    setPosition(pageX, pageY) {
        this.$control.style.top = `${pageY}px`;
        this.$control.style.left = `${pageX}px`;
    }

    hide() {
        this.$control.hidden = true;
    }

    show() {
        this.$control.hidden = false;
    }
}

export { TableControl };