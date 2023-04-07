import { TableBuilder } from "./TableBuilder.js";
export class Table {
    get rowsLength() {
        return this.rowsCount;
    }
    get colsLength() {
        return this.colsCount;
    }
    get tableElement() {
        return this.table;
    }
    constructor(container, rowsCount = 0, colsCount = 0) {
        this.rowsCount = rowsCount;
        this.colsCount = colsCount;
        this.table = TableBuilder.create(rowsCount, colsCount);
        container.appendChild(this.table);
    }
    addRow() {
        const lastRowIdx = this.table.rows.length - 1;
        const lastRow = this.table.rows[lastRowIdx];
        const lastRowCopy = lastRow.cloneNode(true);
        lastRow.after(lastRowCopy);
        this.rowsCount++;
    }
    removeRow() {
        if (this.table.rows.length <= 1)
            return;
        const firstRow = this.table.rows[0];
        firstRow.remove();
        this.rowsCount--;
    }
    addCol() {
        for (const row of this.table.rows) {
            const lastCellIdx = row.cells.length - 1;
            const lastCell = row.cells[lastCellIdx];
            const lastCellCopy = lastCell.cloneNode(true);
            lastCell.after(lastCellCopy);
        }
        this.colsCount++;
    }
    removeCol() {
        for (const row of this.table.rows) {
            if (row.cells.length <= 1)
                return;
            const lastCellIdx = row.cells.length - 1;
            const lastCell = row.cells[lastCellIdx];
            lastCell.remove();
        }
        this.colsCount--;
    }
}
