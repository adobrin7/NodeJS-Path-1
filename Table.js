export class Table {
    $table = null;
    rows = null;

    get rowsLength() {
        return this.rows.length;
    }

    get colsLength() {
        return this.rows[0].cells.length;
    }

    constructor($table) {
        this.$table = $table;
        this.rows = $table.rows;
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