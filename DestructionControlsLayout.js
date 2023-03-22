import { ControlsLayout } from "./ControlsLayout.js";

export class DestructionControlsLayout extends ControlsLayout {
    pointerEvent = null;
    cellUnderPointerCoords = null;
    controlDimensions = null;

    constructor(rowControl, colControl, $table) {
        super(rowControl, colControl, $table);
    }

    layout() {
        const onPointerMove = event => {
            this.tableCoords = this.$table.getBoundingClientRect();
            this.pointerEvent = event;
            const shouldHideControls = this.shouldHideControls();
            if (!shouldHideControls) {
                this.displayControls();
                return;
            }
            this.hideControls();
            document.removeEventListener('pointermove', onPointerMove);
        };
        document.addEventListener('pointermove', onPointerMove);
    }

    shouldHideControls() {
        return this.isPointerOutOfTable() &&
            this.pointerEvent.target !== this.colControl.$control &&
            this.pointerEvent.target !== this.rowControl.$control
    }

    isPointerOutOfTable() {
        const tableExtraArea = this.clientOffset * 2;
        const tableInteractiveArea = {
            left: this.tableCoords.left - tableExtraArea,
            top: this.tableCoords.top - tableExtraArea,
            right: this.tableCoords.right + tableExtraArea,
            bottom: this.tableCoords.bottom + tableExtraArea
        };

        return this.pointerEvent.pageX < tableInteractiveArea.left ||
            this.pointerEvent.pageY < tableInteractiveArea.top ||
            this.pointerEvent.pageX > tableInteractiveArea.right ||
            this.pointerEvent.pageY > tableInteractiveArea.bottom
    }

    displayControls() {
        if (this.pointerEvent.target.tagName !== 'TD') {
            return;
        }
        this.showControls();
        this.cellUnderPointerCoords = this.pointerEvent.target.getBoundingClientRect();
        this.controlDimensions = Math.max(
            this.rowControl.calcDimensions(),
            this.colControl.calcDimensions()
        );
        this.renderControls();
    }

    showControls() {
        this.rowControl.show();
        this.colControl.show();
    }

    hideControls() {
        this.rowControl.hide();
        this.colControl.hide();
    }

    renderControls() {
        this.renderRowControl();
        this.renderColControl();
    }

    renderRowControl() {
        const x = this.tableCoords.left - (this.controlDimensions + this.clientOffset);
        const pageX = x + window.pageXOffset;
        this.rowControl.setPosition(pageX, this.cellUnderPointerCoords.top);
    }

    renderColControl() {
        const y = this.tableCoords.top - (this.controlDimensions + this.clientOffset);
        const pageY = y + window.pageYOffset;
        this.colControl.setPosition(this.cellUnderPointerCoords.left, pageY);
    }
}