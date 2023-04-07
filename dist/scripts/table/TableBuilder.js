export class TableBuilder {
    constructor() {
    }
    static create(rowsCount, colsCount) {
        const table = document.createElement("table");
        const emptyBody = table.createTBody();
        const body = this.fillBody(emptyBody, rowsCount, colsCount);
        table.appendChild(body);
        return table;
    }
    static fillBody(body, rows, cols) {
        const clone = body.cloneNode(true);
        for (let i = 0; i < rows; i++) {
            const emptyRow = document.createElement("tr");
            const row = this.fillRow(emptyRow, cols);
            clone.appendChild(row);
        }
        return clone;
    }
    static fillRow(row, cols) {
        const clone = row.cloneNode(true);
        for (let i = 0; i < cols; i++) {
            const cell = document.createElement("td");
            clone.appendChild(cell);
        }
        return clone;
    }
}
