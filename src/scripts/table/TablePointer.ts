import { ObservedElementTags } from "../enums/ObservedElementTags.js";

export class TablePointer {
    private readonly table: HTMLTableElement;
    private readonly pointer: PointerEvent;
    private readonly observedAreaOffset: number = 40;
    private readonly extendedSearchCoords: { x: number, y: number }[];
    private readonly observedAreaCoords: { top: number, left: number, right: number, bottom: number }[];

    constructor(table: HTMLTableElement, pointer: PointerEvent) {
        this.table = table;
        this.pointer = pointer;

        this.extendedSearchCoords = [ 
            { x: 0, y: 0 },
            { x: this.observedAreaOffset, y: 0 },
            { x: -this.observedAreaOffset, y: 0 },
            { x: 0, y: this.observedAreaOffset },
            { x: 0, y: -this.observedAreaOffset },
        ];

        const tableCoords = this.table.getBoundingClientRect();
        this.observedAreaCoords = [
            {
                top: tableCoords.top - this.observedAreaOffset,
                left: tableCoords.left,
                right: tableCoords.right,
                bottom: tableCoords.bottom + this.observedAreaOffset,
            },
            {
                top: tableCoords.top,
                left: tableCoords.left - this.observedAreaOffset,
                right: tableCoords.right + this.observedAreaOffset,
                bottom: tableCoords.bottom,
            }
        ];
    }

    public findClosestCell(): HTMLTableCellElement | void {
        if (this.isOnTable()) {
            return this.searchCellInTableArea();
        }
        return this.searchCellOutTableArea();
    }

    public isOnTable(): boolean {
        const tableCoords = this.table.getBoundingClientRect();
        return this.pointer.pageX > tableCoords.left &&
            this.pointer.pageY > tableCoords.top &&
            this.pointer.pageX < tableCoords.right &&
            this.pointer.pageY < tableCoords.bottom;
    }

    private searchCellInTableArea(): HTMLTableCellElement | void {
        const target = this.pointer.target as HTMLTableCellElement;
        if (target.tagName == ObservedElementTags.TD) {
            return target;
        }        
    }

    private searchCellOutTableArea(): HTMLTableCellElement | void {
        const closestCell = this.searchClosestCell();
        if (closestCell?.tagName == ObservedElementTags.TD) {
            return closestCell;
        }
    }

    private searchClosestCell(): HTMLTableCellElement | void {
        for (const { x, y } of this.extendedSearchCoords) {
            const cell = document.elementFromPoint(
                this.pointer.pageX + x, 
                this.pointer.pageY + y
            );
            if (cell?.tagName === ObservedElementTags.TD) {
                return cell as HTMLTableCellElement;
            }
        }
    }

    public isInObserveArea(): boolean {
        return this.observedAreaCoords.some(coord => {
            return this.pointer.pageX > coord.left &&
            this.pointer.pageX < coord.right &&
            this.pointer.pageY > coord.top &&
            this.pointer.pageY < coord.bottom;
        });
    }
}

