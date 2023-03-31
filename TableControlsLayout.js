export class TableControlsLayout {
    addRowControl = null;
    removeRowControl = null;
    addColControl = null;
    removeColControl = null;

    clientOffset = null;

    controlDimensions = 40; // TODO: constructor param or getcomputdstyle
    pointerEvent = null;
    observeAreaCoords = null;
    tableCoords = null;
    tableOffset = null;
    cellUnderPointerCoords = null;

    constructor(
        addRowControl,
        removeRowControl,
        addColControl,
        removeColControl,
        table,
    ) {
        this.addRowControl = addRowControl;
        this.removeRowControl = removeRowControl;
        this.addColControl = addColControl;
        this.removeColControl = removeColControl;

        this.table = table;

        this.clientOffset = Math.max(
            this.table.$table.firstElementChild.offsetLeft,
            this.table.$table.firstElementChild.offsetTop,
        );

        document.addEventListener('controlPressed', pointerCoord => this.onControlPressed(pointerCoord));
    }

    onControlPressed(pointerCoord) {
        this.pointerEvent = {
            pageX: pointerCoord.detail.pageX,
            pageY: pointerCoord.detail.pageY,
            target: pointerCoord.detail.target
        }
        this.observeAreaCoords = this.observeAreaCoords;

        if (this.pointerEvent.target.classList.contains('add-control')) {
            this.hideControls();
            return;
        }
        this.layoutInAreaCoords();
        if (this.table.rowsLength <= 1) {
            this.removeRowControl.hide();
        }
        if (this.table.colsLength <= 1) {
            this.removeColControl.hide();
        }
    }

    hideControls() {
        this.hideCreationControls();
        this.hideDestructionControls();
    }

    hideDestructionControls() {
        this.removeRowControl.hide();
        this.removeColControl.hide();
    }

    hideCreationControls() {
        this.addRowControl.hide();
        this.addColControl.hide();
    }

    showControls() {
        this.showCreationControls();
        this.showDestructionControls();
    }

    showCreationControls() {
        this.addRowControl.show();
        this.addColControl.show();
    }

    showDestructionControls() {
        if (this.table.rowsLength > 1) {
            this.removeRowControl.show();
        }
        if (this.table.colsLength > 1) {
            this.removeColControl.show();
        }
    }

    // TODO: calc observe area in the class
    layout(event, observeAreaCoords) {
        this.pointerEvent = event;
        this.observeAreaCoords = observeAreaCoords;
        this.tableCoords = this.table.$table.getBoundingClientRect();
        this.tableOffset = Math.abs(this.tableCoords.left - this.observeAreaCoords.left) + this.table.$table.clientLeft * 2; // TODO: make field maybe and remove part after parentheses

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
        if (this.pointerEvent.target.tagName !== 'TD') {
            return;
        }

        this.tableCoords = this.table.$table.getBoundingClientRect();
        this.showControls();
        this.cellUnderPointerCoords = this.pointerEvent.target.getBoundingClientRect();
        this.layoutControls();
    }

    layoutInAreaCoords() {
        const closestCell = this.getPointerClosestCell();
        if (closestCell?.tagName !== 'TD') {
            return;
        }
        this.cellUnderPointerCoords = closestCell.getBoundingClientRect();
        this.layoutControls();
        this.showControls();
    }

    getPointerClosestCell() {
        const pointerTriggerRadius = [ // TODO: make field maybe
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

        let $closestCell = null;
        for (const { x, y } of pointerTriggerRadius) {
            const $cell = document.elementFromPoint(this.pointerEvent.pageX + x, this.pointerEvent.pageY + y);
            if ($cell?.tagName === 'TD') {
                $closestCell = $cell;
                break;
            }
        }
        return $closestCell;
    }

    layoutControls() {
        this.layoutCreationControls();
        this.layoutDestructionControls();
    }

    layoutCreationControls() {
        this.layoutCreateRowControl();
        this.layoutCreateColControl();
    }

    layoutCreateRowControl() {
        const y = this.tableCoords.bottom + this.clientOffset * 2;
        this.addRowControl.setPosition(this.cellUnderPointerCoords.left, y);
    }

    layoutCreateColControl() {
        const x = this.tableCoords.right + this.clientOffset * 2;
        this.addColControl.setPosition(x, this.cellUnderPointerCoords.top);
    }

    layoutDestructionControls() {
        this.layoutRemoveRowControl();
        this.layoutRemoveColControl();
    }

    layoutRemoveRowControl() {
        const x = this.tableCoords.left - (this.controlDimensions + this.clientOffset);
        this.removeRowControl.setPosition(x, this.cellUnderPointerCoords.top);
    }

    layoutRemoveColControl() {
        const y = this.tableCoords.top - (this.controlDimensions + this.clientOffset);
        this.removeColControl.setPosition(this.cellUnderPointerCoords.left, y);
    }
}