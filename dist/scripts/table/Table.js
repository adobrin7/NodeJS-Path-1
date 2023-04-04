export class Table {
    $container = null;

    $table = null;
    rows = null;

    get rowsLength() {
        return this.rows.length;
    }

    get colsLength() {
        return this.rows[0].cells.length;
    }

    constructor(rows, cols, $container) {
        this.$container = $container;
        this.generateTableToContainer(rows, cols);
    }

    generateTableToContainer(rows, cols) {
        this.$table = document.createElement("table");
        const $tbody = document.createElement("tbody");

        this.fillTableBody($tbody, rows, cols);

        this.$table.appendChild($tbody);
        this.$container.appendChild(this.$table);

        this.rows = this.$table.rows;
    }

    fillTableBody($tbody, rows, cols) {
        for (let i = 0; i < rows; i++) {
            const $row = document.createElement("tr");
            this.fillTableRow($row, cols);
            $tbody.appendChild($row);
        }
    }

    fillTableRow($row, cols) {
        for (let j = 0; j < cols; j++) {
            const $cell = document.createElement("td");
            $row.appendChild($cell);
        }
    }

    addRow() {
        const lastRowIdx = this.rows.length - 1;
        const $lastRow = this.rows[lastRowIdx];
        const $lastRowCopy = $lastRow.cloneNode(true);
        $lastRow.after($lastRowCopy);
    }

    removeRow() {
        if (this.rows.length <= 1)
            return;
        const $firstRow = this.rows[0];
        $firstRow.remove();
    }

    addCol() {
        for (const row of this.rows) {
            const lastCellIdx = row.cells.length - 1;
            const $lastCell = row.cells[lastCellIdx];
            const $lastCellCopy = $lastCell.cloneNode(true);
            $lastCell.after($lastCellCopy);
        }
    }

    removeCol() {
        for (const row of this.rows) {
            if (row.cells.length <= 1)
                return;
            const lastCellIdx = row.cells.length - 1;
            const $lastCell = row.cells[lastCellIdx];
            $lastCell.remove();
        }
    }
}