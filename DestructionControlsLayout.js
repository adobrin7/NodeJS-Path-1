import { ControlsLayout } from "./ControlsLayout.js";

export class DestructionControlsLayout extends ControlsLayout {
    table = null;

    pointerEvent = null;
    observeAreaCoords = null;
    tableCoords = null;
    cellUnderPointerCoords = null;
    controlDimensions = null;

    constructor(rowControl, colControl, $table, table) {
        super(rowControl, colControl, $table);
        this.table = table;
    }

    layout(event, observeAreaCoords) {
        this.pointerEvent = event;
        this.observeAreaCoords = observeAreaCoords;
        this.tableCoords = this.$table.getBoundingClientRect();

        if (this.isPointerOnTable()) {
            this.layoutInTableCoords(event);
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

    getPointerClosestCell() {
        const tableOffset = Math.abs(this.tableCoords.left - this.observeAreaCoords.left) + this.$table.clientLeft * 2;
        const pointerTriggerRadius = [
            [0, 0],
            [tableOffset, 0],
            [-tableOffset, 0],
            [0, tableOffset],
            [0, -tableOffset],
            [tableOffset, tableOffset],
            [-tableOffset, -tableOffset],
            [-tableOffset, tableOffset],
            [tableOffset, -tableOffset],
        ];

        let $closestCell = null;
        for (const [x, y] of pointerTriggerRadius) {
            const $cell = document.elementFromPoint(this.pointerEvent.pageX + x, this.pointerEvent.pageY + y);
            if ($cell?.tagName === 'TD') {
                $closestCell = $cell;
                break;
            }
        }
        return $closestCell;
    }

    layoutInTableCoords(event) {
        if (event.target.tagName !== 'TD') {    
            return;
        }

        this.tableCoords = this.$table.getBoundingClientRect();
        this.showControls();
        this.cellUnderPointerCoords = event.target.getBoundingClientRect();
        this.controlDimensions = Math.max(
            this.rowControl.calcDimensions(),
            this.colControl.calcDimensions()
        );
        this.renderControls();
    }

    layoutInAreaCoords() {
        this.showControls();
        const closestCell = this.getPointerClosestCell();
        if (closestCell?.tagName !== 'TD') {
            return;
        }
        this.cellUnderPointerCoords = closestCell.getBoundingClientRect();
        this.controlDimensions = Math.max(
            this.rowControl.calcDimensions(),
            this.colControl.calcDimensions()
        );
        this.showControls();
        this.renderControls();
    }

    showControls() {
        if (this.table.rowsLength > 1) {
            this.rowControl.show();
        }
        if(this.table.colsLength > 1) {
            this.colControl.show();
        }
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