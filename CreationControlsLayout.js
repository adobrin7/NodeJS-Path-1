import { ControlsLayout } from "./ControlsLayout.js";

export class CreationControlsLayout extends ControlsLayout {
    pointerEvent = null;
    observeAreaCoords = null;
    tableCoords = null;
    tableOffset = null;
    cellUnderPointerCoords = null;
    controlDimensions = null;

    constructor(rowControl, colControl, $table) {
        super(rowControl, colControl, $table);
    }

    layout(event, observeAreaCoords) {
        this.pointerEvent = event;
        this.observeAreaCoords = observeAreaCoords;
        this.tableCoords = this.$table.getBoundingClientRect();
        this.tableOffset = Math.abs(this.tableCoords.left - this.observeAreaCoords.left);

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
        this.layoutControls();
    }

    layoutInAreaCoords() {
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
        this.layoutControls();
    }

    showControls() {
        this.rowControl.show();
        this.colControl.show();
    }

    hideControls() {
        this.rowControl.hide();
        this.colControl.hide();
    }
    
    layoutControls() {
        this.layoutRowControl();
        this.layoutColControl();
    }

    layoutRowControl() {
        const y = this.tableCoords.bottom + this.clientOffset * 2;
        this.rowControl.setPosition(this.cellUnderPointerCoords.left, y);
    }

    layoutColControl() {
        const x = this.tableCoords.right + this.clientOffset * 2;
        this.colControl.setPosition(x, this.cellUnderPointerCoords.top);
    }
}