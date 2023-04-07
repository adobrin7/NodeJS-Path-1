import { TableBuilder } from "./TableBuilder.js";

export class Table {
    private rowsCount: number;
    private colsCount: number;
    private readonly table: HTMLTableElement;

    get rowsLength(): number {
        return this.rowsCount;
    }

    get colsLength(): number {
        return this.colsCount;
    }

    get tableElement(): HTMLTableElement {
        return this.table;
    }

    constructor(container: HTMLElement, rowsCount: number = 0, colsCount: number = 0) {
        this.rowsCount = rowsCount;
        this.colsCount = colsCount;
        this.table = TableBuilder.create(rowsCount, colsCount);
        container.appendChild(this.table);
    }

    public addRow(): void {
        const lastRowIdx = this.table.rows.length - 1;
        const lastRow = this.table.rows[lastRowIdx];
        const lastRowCopy = lastRow.cloneNode(true);
        lastRow.after(lastRowCopy);
        this.rowsCount++;
    }

    public removeRow(): void {
        if (this.table.rows.length <= 1)
            return;
        const firstRow = this.table.rows[0];
        firstRow.remove();
        this.rowsCount--;
    }

    public addCol(): void {
        for (const row of this.table.rows) {
            const lastCellIdx = row.cells.length - 1;
            const lastCell = row.cells[lastCellIdx];
            const lastCellCopy = lastCell.cloneNode(true);
            lastCell.after(lastCellCopy);
        }
        this.colsCount++;
    }

    public removeCol(): void {
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