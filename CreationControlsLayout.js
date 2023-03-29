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
        return this.getClosestRightTopCell() ?? this.getClosestLeftBottomCell();
    }
    
    getClosestRightTopCell() {
        const isPointerOnLeftOrRight = (this.pointerEvent.pageX < this.tableCoords.left) ||
            (this.pointerEvent.pageX > this.tableCoords.right);
        const isPointerOnTopOrBottom = (this.pointerEvent.pageY < this.tableCoords.top) ||
            (this.pointerEvent.pageY > this.tableCoords.bottom);
        
        const res = document.elementFromPoint(
            this.pointerEvent.pageX + (isPointerOnLeftOrRight ? this.tableOffset : 0),
            this.pointerEvent.pageY + (isPointerOnTopOrBottom ? this.tableOffset : 0), 
        );
        return res?.tagName === 'TD' ? res : null;
    }
    
    getClosestLeftBottomCell() {
        const isPointerOnLeftOrRight = (this.pointerEvent.pageX < this.tableCoords.left) ||
            (this.pointerEvent.pageX > this.tableCoords.right);
        const isPointerOnTopOrBottom = (this.pointerEvent.pageY < this.tableCoords.top) ||
            (this.pointerEvent.pageY > this.tableCoords.bottom);
        
        const res = document.elementFromPoint(
            this.pointerEvent.pageX - (isPointerOnLeftOrRight ? this.tableOffset : 0),
            this.pointerEvent.pageY - (isPointerOnTopOrBottom ? this.tableOffset : 0), 
        );
        return res?.tagName === 'TD' ? res : null;
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