export class TableBuilder {
    private constructor() {
        
    }

    public static create(rowsCount: number, colsCount: number): HTMLTableElement {
        const table = document.createElement("table");
        const emptyBody = table.createTBody();
        const body = this.fillBody(emptyBody, rowsCount, colsCount);
        table.appendChild(body);
        return table;
    }

    private static fillBody(body: HTMLTableSectionElement, rows: number, cols: number): HTMLTableSectionElement {
        const clone = body.cloneNode(true) as HTMLTableSectionElement;
        for (let i = 0; i < rows; i++) {
            const emptyRow = document.createElement("tr");
            const row = this.fillRow(emptyRow, cols);
            clone.appendChild(row);
        }
        return clone;
    }

    private static fillRow(row: HTMLTableRowElement, cols: number): HTMLTableRowElement {
        const clone = row.cloneNode(true) as HTMLTableRowElement;
        for (let i = 0; i < cols; i++) {
            const cell = document.createElement("td");
            clone.appendChild(cell);
        }
        return clone;
    }
}