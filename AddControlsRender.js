import { ControlRender } from "./ControlsRender.js";

class AddControlsRender extends ControlRender {
    constructor(rowControl, colControl, $table) {
        super(rowControl, colControl, $table);
        this.coords = $table.getBoundingClientRect();
    }

    render() {
        this.renderRowControl();
        this.renderColControl();
    }

    renderRowControl() {
        const pageX = this.coords.left + window.pageXOffset;
        const pageY = this.coords.bottom + window.pageYOffset;
        this.rowControl.setPosition(
            pageX + this.tableBodyTableContentDiff, 
            pageY + this.tableBodyTableContentDiff
        );
    }

    renderColControl() {
        const pageX = this.coords.right + window.pageXOffset;
        const pageY = this.coords.top + window.pageYOffset;
        this.colControl.setPosition(
            pageX + this.tableBodyTableContentDiff, 
            pageY + this.tableBodyTableContentDiff
        );
    }
}

export { AddControlsRender };