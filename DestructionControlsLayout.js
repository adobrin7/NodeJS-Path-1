import { ControlsLayout } from "./ControlsLayout.js";

export class DestructionControlsLayout extends ControlsLayout {
    pointerEvent = null;
    observeAreaCoords = null;
    tableCoords = null;
    cellUnderPointerCoords = null;
    controlDimensions = null;

    constructor(rowControl, colControl, $table) {
        super(rowControl, colControl, $table);
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
        const tableOffset = Math.abs(this.tableCoords.left - this.observeAreaCoords.left);
        
        const isPointerOnLeftOrRight = (this.pointerEvent.pageX < this.tableCoords.left) ||
            (this.pointerEvent.pageX > this.tableCoords.right);
        const isPointerOnTopOrBottom = (this.pointerEvent.pageY < this.tableCoords.top) ||
            (this.pointerEvent.pageY > this.tableCoords.bottom);

        const $closestCell = document.elementFromPoint(
            this.pointerEvent.pageX + (isPointerOnLeftOrRight ? tableOffset : 0),
            this.pointerEvent.pageY + (isPointerOnTopOrBottom ? tableOffset : 0), 
        );

        const $closestCell2 = document.elementFromPoint(
            this.pointerEvent.pageX - (isPointerOnLeftOrRight ? tableOffset : 0),
            this.pointerEvent.pageY - (isPointerOnTopOrBottom ? tableOffset : 0), 
        );

        return $closestCell.tagName === 'TD' ? $closestCell : $closestCell2;
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