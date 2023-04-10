export class ControlsLayout {
    constructor(addRowControl, removeRowControl, addColControl, removeColControl, table) {
        this.controlDimensions = 40;
        this.clientOffset = 2;
        this.addRowControl = addRowControl;
        this.removeRowControl = removeRowControl;
        this.addColControl = addColControl;
        this.removeColControl = removeColControl;
        this.table = table;
        this.addListeners();
    }
    addListeners() {
        document.addEventListener('tableChanged', (event) => this.onTableChanged(event));
    }
    onTableChanged(event) {
        if (event.detail.isDestruction) {
            this.handleDestructionChange();
            return;
        }
        this.handleCreationChange(event.detail.isHorizontal);
    }
    handleDestructionChange() {
        if (this.table.rowsLength <= 1 || this.table.colsLength <= 1) {
            this.removeRowControl.hide();
            this.removeColControl.hide();
        }
    }
    handleCreationChange(isHorizontal) {
        if (isHorizontal) {
            this.addColControl.shiftRight();
            this.addRowControl.shiftRight();
            this.removeColControl.shiftRight();
        }
        else if (this.table.rowsLength > 1) {
            this.addRowControl.shiftBottom();
            this.addColControl.shiftBottom();
            this.removeRowControl.shiftBottom();
        }
    }
    hideControls() {
        this.hideCreationControls();
        this.removeRowControl.hide();
        this.removeColControl.hide();
    }
    hideCreationControls() {
        this.addRowControl.hide();
        this.addColControl.hide();
    }
    showControls() {
        this.addRowControl.show();
        this.addColControl.show();
        if (this.table.rowsLength > 1) {
            this.removeRowControl.show();
        }
        if (this.table.colsLength > 1) {
            this.removeColControl.show();
        }
    }
    layout(pointer) {
        this.tableCoords = this.table.tableElement.getBoundingClientRect();
        const pointerClosestCell = pointer.findClosestCell();
        this.cellUnderPointerCoords = pointerClosestCell === null || pointerClosestCell === void 0 ? void 0 : pointerClosestCell.getBoundingClientRect();
        this.layoutControls();
    }
    layoutControls() {
        if (!this.cellUnderPointerCoords) {
            return;
        }
        this.layoutCreationControls();
        this.layoutDestructionControls();
        this.showControls();
    }
    layoutCreationControls() {
        const y = this.tableCoords.bottom + this.clientOffset;
        this.addRowControl.setPosition(this.cellUnderPointerCoords.left, y);
        const x = this.tableCoords.right + this.clientOffset;
        this.addColControl.setPosition(x, this.cellUnderPointerCoords.top);
    }
    layoutDestructionControls() {
        const x = this.tableCoords.left - (this.controlDimensions + this.clientOffset);
        this.removeRowControl.setPosition(x, this.cellUnderPointerCoords.top);
        const y = this.tableCoords.top - (this.controlDimensions + this.clientOffset);
        this.removeColControl.setPosition(this.cellUnderPointerCoords.left, y);
    }
}
