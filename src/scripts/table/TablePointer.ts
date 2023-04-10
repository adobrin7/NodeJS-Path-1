export class TablePointer {
    private readonly table: HTMLTableElement;
    private readonly pointer: PointerEvent;
    private readonly observedAreaOffset: number = 40;
    private readonly extendedSearchCoords: { x: number, y: number }[];
    private readonly observedAreaCoords: { top: number, left: number, right: number, bottom: number };

    constructor(table: HTMLTableElement, pointer: PointerEvent) {
        this.table = table;
        this.pointer = pointer;

        this.extendedSearchCoords = [ 
            { x: 0, y: 0 },
            { x: this.observedAreaOffset, y: 0 },
            { x: -this.observedAreaOffset, y: 0 },
            { x: 0, y: this.observedAreaOffset },
            { x: 0, y: -this.observedAreaOffset },
            
            { x: this.observedAreaOffset, y: this.observedAreaOffset },
            { x: -this.observedAreaOffset, y: -this.observedAreaOffset },
            { x: -this.observedAreaOffset, y: this.observedAreaOffset },
            { x: this.observedAreaOffset, y: -this.observedAreaOffset },
        ];

        const tableCoords = this.table.getBoundingClientRect();
        this.observedAreaCoords = {
            top: tableCoords.top - this.observedAreaOffset,
            left: tableCoords.left - this.observedAreaOffset,
            right: tableCoords.right + this.observedAreaOffset,
            bottom: tableCoords.bottom + this.observedAreaOffset,
        };
    }

    public findClosestCell(): HTMLTableCellElement | null {
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

    private searchCellInTableArea(): HTMLTableCellElement | null {
        const target = this.pointer.target as HTMLTableCellElement;
        if (target.tagName !== 'TD') {
            return null;
        }
        return target;
    }

    private searchCellOutTableArea(): HTMLTableCellElement | null {
        const closestCell = this.searchClosestCell();
        if (closestCell?.tagName !== 'TD') {
            return null;
        }
        return closestCell;
    }

    private searchClosestCell(): HTMLTableCellElement | null {
        for (const { x, y } of this.extendedSearchCoords) {
            const cell = document.elementFromPoint(
                this.pointer.pageX + x, 
                this.pointer.pageY + y
            );
            if (cell?.tagName === 'TD') {
                return cell as HTMLTableCellElement;
            }
        }
        return null;
    }

    public isInObserveArea(): boolean {
        return this.pointer.pageX > this.observedAreaCoords.left &&
            this.pointer.pageX < this.observedAreaCoords.right &&
            this.pointer.pageY > this.observedAreaCoords.top &&
            this.pointer.pageY < this.observedAreaCoords.bottom;
    }
}

