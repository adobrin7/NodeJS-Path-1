import { Table } from "../table/Table.js";
import { ControlElement } from "./ControlElement.js";

export class TableControlsLayout {
    private readonly addRowControl: ControlElement;
    private readonly removeRowControl: ControlElement;
    private readonly addColControl: ControlElement;
    private readonly removeColControl: ControlElement;

    private readonly table: Table;
    private readonly tableOffset: number;

    private readonly pointerTriggerRadius: {x: number, y: number}[];
    private readonly clientOffset = 2;

    private readonly controlDimensions = 40; 
    private pointerEvent?: PointerEvent;
    private tableCoords?: DOMRect;
    private cellUnderPointerCoords?: DOMRect;

    constructor(
        addRowControl: ControlElement,
        removeRowControl: ControlElement,
        addColControl: ControlElement,
        removeColControl: ControlElement,
        table: Table,
        tableOffset: number
    ) {
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

    private onControlPressed(): void {
        if (this.table.rowsLength <= 1) {
            this.removeRowControl.hide();
        }
        if (this.table.colsLength <= 1) {
            this.removeColControl.hide();
        }
    }

    public hideControls(): void {
        this.hideCreationControls();
        this.removeRowControl.hide();
        this.removeColControl.hide();
    }

    public hideCreationControls(): void {
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

    public layout(event: PointerEvent): void {
        this.pointerEvent = event;
        this.tableCoords = this.table.tableElement.getBoundingClientRect();

        if (this.isPointerOnTable()) {
            this.layoutInTableCoords();
            return;
        }

        this.layoutInAreaCoords();
    }

    private isPointerOnTable(): boolean {
        return this.pointerEvent!.pageX > this.tableCoords!.left &&
            this.pointerEvent!.pageY > this.tableCoords!.top &&
            this.pointerEvent!.pageX < this.tableCoords!.right &&
            this.pointerEvent!.pageY < this.tableCoords!.bottom;
    }

    private layoutInTableCoords(): void {
        const target = this.pointerEvent!.target as HTMLElement;
        if (target.tagName !== 'TD') {
            return;
        }

        this.tableCoords = this.table.tableElement.getBoundingClientRect();
        this.cellUnderPointerCoords = target.getBoundingClientRect();
        this.layoutControls();
        this.showControls();
    }

    private layoutInAreaCoords(): void {
        const closestCell = this.getPointerClosestCell();
        if (closestCell?.tagName !== 'TD') {
            return;
        }
        this.cellUnderPointerCoords = closestCell.getBoundingClientRect();
        this.layoutControls();
        this.showControls();
    }

    private getPointerClosestCell(): HTMLTableCellElement | null {
        let closestCell = null;
        for (const { x, y } of this.pointerTriggerRadius) {
            const cell = document.elementFromPoint(this.pointerEvent!.pageX + x, this.pointerEvent!.pageY + y);
            if (cell?.tagName === 'TD') {
                closestCell = cell;
                break;
            }
        }
        return closestCell as HTMLTableCellElement;
    }

    private layoutControls(): void {
        this.layoutCreationControls();
        this.layoutDestructionControls();
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