import { ControlRender } from "./ControlsRender.js";

class RemoveControlsRender extends ControlRender {
    constructor(rowControl, colControl, $table) {
        super(rowControl, colControl, $table);
        this.tableCoords = $table.getBoundingClientRect();

        new MutationObserver(() => this.hideControls())
            .observe($table, { childList: true, subtree: true });
    }

    render() {
        const pointerMoveHandler = event => {
            this.pointerEvent = event;
            if (!this.shouldHideControls()) {
                this.displayControls();
                return;
            }
            this.hideControls();
            document.removeEventListener('pointermove', pointerMoveHandler);
        };
        document.addEventListener('pointermove', pointerMoveHandler);
    }

    displayControls() {
        if (this.pointerEvent.target.tagName !== 'TD') {
            return;
        }
        this.showControls();
        this.cellCoords = this.pointerEvent.target.getBoundingClientRect();
        this.controllerDimensions = Math.max(
            this.rowControl.$control.offsetWidth,
            this.colControl.$control.offsetHeight
        );
        this.renderControls();
    }

    shouldHideControls() {
        return this.isPointerOutOfTable() &&
            this.pointerEvent.target !== this.colControl.$control &&
            this.pointerEvent.target !== this.rowControl.$control
    }

    isPointerOutOfTable() {
        const tableCoords = this.$table.getBoundingClientRect();
        const tableExtraArea = this.$table.clientTop * 2;
        const tableInteractiveArea = {
            left: tableCoords.left - tableExtraArea,
            top: tableCoords.top - tableExtraArea,
            right: tableCoords.right + tableExtraArea,
            bottom: tableCoords.bottom + tableExtraArea
        };
        return this.pointerEvent.pageX < tableInteractiveArea.left ||
            this.pointerEvent.pageY < tableInteractiveArea.top ||
            this.pointerEvent.pageX > tableInteractiveArea.right ||
            this.pointerEvent.pageY > tableInteractiveArea.bottom
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
        const x = this.tableCoords.left - (this.controllerDimensions + this.tableBodyTableContentDiff);
        const pageX = x + window.pageXOffset;
        this.rowControl.setPosition(pageX, this.cellCoords.top);
    }

    renderColControl() {
        const y = this.tableCoords.top - (this.controllerDimensions + this.tableBodyTableContentDiff);
        const pageY = y + window.pageYOffset;
        this.colControl.setPosition(this.cellCoords.left, pageY);
    }
}

export { RemoveControlsRender };