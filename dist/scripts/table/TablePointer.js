export class TablePointer {
    constructor(table, pointer) {
        this.observedAreaOffset = 40;
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
    findClosestCell() {
        if (this.isOnTable()) {
            return this.searchCellInTableArea();
        }
        return this.searchCellOutTableArea();
    }
    isOnTable() {
        const tableCoords = this.table.getBoundingClientRect();
        return this.pointer.pageX > tableCoords.left &&
            this.pointer.pageY > tableCoords.top &&
            this.pointer.pageX < tableCoords.right &&
            this.pointer.pageY < tableCoords.bottom;
    }
    searchCellInTableArea() {
        const target = this.pointer.target;
        if (target.tagName !== 'TD') {
            return null;
        }
        return target;
    }
    searchCellOutTableArea() {
        const closestCell = this.searchClosestCell();
        if ((closestCell === null || closestCell === void 0 ? void 0 : closestCell.tagName) !== 'TD') {
            return null;
        }
        return closestCell;
    }
    searchClosestCell() {
        for (const { x, y } of this.extendedSearchCoords) {
            const cell = document.elementFromPoint(this.pointer.pageX + x, this.pointer.pageY + y);
            if ((cell === null || cell === void 0 ? void 0 : cell.tagName) === 'TD') {
                return cell;
            }
        }
        return null;
    }
    isInObserveArea() {
        return this.pointer.pageX > this.observedAreaCoords.left &&
            this.pointer.pageX < this.observedAreaCoords.right &&
            this.pointer.pageY > this.observedAreaCoords.top &&
            this.pointer.pageY < this.observedAreaCoords.bottom;
    }
}
