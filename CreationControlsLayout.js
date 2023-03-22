import { ControlsLayout } from "./ControlsLayout.js";

export class CreationControlsLayout extends ControlsLayout {
    constructor(rowControl, colControl, $table) {
        super(rowControl, colControl, $table);
    }

    layout() {
        this.layoutRowControl();
        this.layoutColControl();
    }

    layoutRowControl() {
        const tableCoords = this.$table.getBoundingClientRect();
        const pageX = tableCoords.left + window.pageXOffset;
        const pageY = tableCoords.bottom + window.pageYOffset;
        this.rowControl.setPosition(
            pageX + this.clientOffset,
            pageY + this.clientOffset
        );
    }

    layoutColControl() {
        const tableCoords = this.$table.getBoundingClientRect();
        const pageX = tableCoords.right + window.pageXOffset;
        const pageY = tableCoords.top + window.pageYOffset;
        this.colControl.setPosition(
            pageX + this.clientOffset,
            pageY + this.clientOffset
        );
    }
}