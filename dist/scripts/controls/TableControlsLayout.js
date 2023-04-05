export class TableControlsLayout {
    constructor(addRowControl, removeRowControl, addColControl, removeColControl, table, tableOffset) {
        this.clientOffset = 2;
        this.controlDimensions = 40;
        this.addRowControl = addRowControl;
        this.removeRowControl = removeRowControl;
        this.addColControl = addColControl;
        this.removeColControl = removeColControl;
        this.tableOffset = tableOffset;
        this.pointerTriggerRadius = [
            { x: 0, y: 0 },
            { x: this.tableOffset, y: 0 },
            { x: -this.tableOffset, y: 0 },
            { x: 0, y: this.tableOffset },
            { x: 0, y: -this.tableOffset },
            { x: this.tableOffset, y: this.tableOffset },
            { x: -this.tableOffset, y: -this.tableOffset },
            { x: -this.tableOffset, y: this.tableOffset },
            { x: this.tableOffset, y: -this.tableOffset },
        ];
        this.table = table;
        document.addEventListener('controlPressed', () => this.onControlPressed());
    }
    onControlPressed() {
        if (this.table.rowsLength <= 1) {
            this.removeRowControl.hide();
        }
        if (this.table.colsLength <= 1) {
            this.removeColControl.hide();
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
    layout(event) {
        this.pointerEvent = event;
        this.tableCoords = this.table.tableElement.getBoundingClientRect();
        if (this.isPointerOnTable()) {
            this.layoutInTableCoords();
            return;
        }
        this.layoutInAreaCoords();
    }
    isPointerOnTable() {
        return this.pointerEvent.pageX > this.tableCoords.left &&
            this.pointerEvent.pageY > this.tableCoords.top &&
            this.pointerEvent.pageX < this.tableCoords.right &&
            this.pointerEvent.pageY < this.tableCoords.bottom;
    }
    layoutInTableCoords() {
        const target = this.pointerEvent.target;
        if (target.tagName !== 'TD') {
            return;
        }
        this.tableCoords = this.table.tableElement.getBoundingClientRect();
        this.cellUnderPointerCoords = target.getBoundingClientRect();
        this.layoutControls();
        this.showControls();
    }
    layoutInAreaCoords() {
        const closestCell = this.getPointerClosestCell();
        if ((closestCell === null || closestCell === void 0 ? void 0 : closestCell.tagName) !== 'TD') {
            return;
        }
        this.cellUnderPointerCoords = closestCell.getBoundingClientRect();
        this.layoutControls();
        this.showControls();
    }
    getPointerClosestCell() {
        let closestCell = null;
        for (const { x, y } of this.pointerTriggerRadius) {
            const cell = document.elementFromPoint(this.pointerEvent.pageX + x, this.pointerEvent.pageY + y);
            if ((cell === null || cell === void 0 ? void 0 : cell.tagName) === 'TD') {
                closestCell = cell;
                break;
            }
        }
        return closestCell;
    }
    layoutControls() {
        this.layoutCreationControls();
        this.layoutDestructionControls();
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
