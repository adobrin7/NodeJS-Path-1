import { TableEvents } from "../enums/TableEvents.js";
import { Table } from "../table/Table.js";
import { TablePointer } from "../table/TablePointer.js";
import { ControlElement } from "./ControlElement.js";

export class ControlsLayout {
    private readonly addRowControl: ControlElement;
    private readonly removeRowControl: ControlElement;
    private readonly addColControl: ControlElement;
    private readonly removeColControl: ControlElement;
    private readonly table: Table;

    private readonly controlDimensions = 40; 
    private readonly clientOffset = 2;

    private tableCoords?: DOMRect;
    private cellUnderPointerCoords?: DOMRect;

    constructor(
        addRowControl: ControlElement,
        removeRowControl: ControlElement,
        addColControl: ControlElement,
        removeColControl: ControlElement,
        table: Table
    ) {
        this.addRowControl = addRowControl;
        this.removeRowControl = removeRowControl;
        this.addColControl = addColControl;
        this.removeColControl = removeColControl;
        this.table = table;

        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener(
            TableEvents.TABLE_CHANGED, 
            (event) => this.onTableChanged(event as CustomEvent<{isHorizontal: boolean, isDestruction: boolean}>)
        );
    }

    private onTableChanged(event: CustomEvent<{ isHorizontal: boolean, isDestruction: boolean }>): void {
        if (event.detail.isDestruction) {
            this.handleDestructionChange();
            return;
        }
        this.handleCreationChange(event.detail.isHorizontal);
    }

    private handleDestructionChange(): void {
        if (this.table.rowsLength <= 1 || this.table.colsLength <= 1) {
            this.removeRowControl.hide();
            this.removeColControl.hide();
        } 
    }

    private handleCreationChange(isHorizontal: boolean): void {
        if (isHorizontal) {            
            this.addColControl.shiftRight();
            this.addRowControl.shiftRight();
            this.removeColControl.shiftRight();
        } else if (this.table.rowsLength > 1) {
            this.addRowControl.shiftBottom();
            this.addColControl.shiftBottom();
            this.removeRowControl.shiftBottom();
        }
    }

    public hideControls(): void {
        this.hideCreationControls();
        this.removeRowControl.hide();
        this.removeColControl.hide();
    }

    private hideCreationControls(): void {
        this.addRowControl.hide();
        this.addColControl.hide();
    }

    public showControls(): void {
        this.addRowControl.show();
        this.addColControl.show();
        if (this.table.rowsLength > 1) {
            this.removeRowControl.show();
        }
        if (this.table.colsLength > 1) {
            this.removeColControl.show();
        }
    }

    public layout(pointer: TablePointer): void {
        this.tableCoords = this.table.tableElement.getBoundingClientRect();
        const pointerClosestCell = pointer.findClosestCell();
        this.cellUnderPointerCoords = pointerClosestCell?.getBoundingClientRect();
        this.layoutControls();
    }

    private layoutControls(): void {
        if (!this.cellUnderPointerCoords) {
            return;
        }
        this.layoutCreationControls();
        this.layoutDestructionControls();
        this.showControls();
    }

    private layoutCreationControls(): void {
        const y = this.tableCoords!.bottom + this.clientOffset;
        this.addRowControl.setPosition(this.cellUnderPointerCoords!.left, y);
        const x = this.tableCoords!.right + this.clientOffset;       
        this.addColControl.setPosition(x, this.cellUnderPointerCoords!.top);
    }

    private layoutDestructionControls(): void {
        const x = this.tableCoords!.left - (this.controlDimensions + this.clientOffset);
        this.removeRowControl.setPosition(x, this.cellUnderPointerCoords!.top);
        const y = this.tableCoords!.top - (this.controlDimensions + this.clientOffset);
        this.removeColControl.setPosition(this.cellUnderPointerCoords!.left, y);
    }
}