// логика таблицы
class Table {

    constructor($table) {
        this.$table = $table;
    }
    
    addRow() {
        const $lastRow = this.$table.rows[this.$table.rows.length - 1];
        $lastRow.after($lastRow.cloneNode(true));
    }

    removeRow() {
        if (this.$table.rows.length <= 1)
            return;
        const $firstRow = this.$table.rows[0];
        $firstRow.remove();
    }

    addCol() {
        for (const row of this.$table.rows) {
            const $lastCell = row.cells[row.cells.length - 1];
            $lastCell.after($lastCell.cloneNode(true));
        }
    }

    removeCol() {
        for (const row of this.$table.rows) {
            if (row.cells.length <= 1)
                return;
            const $lastCell = row.cells[row.cells.length - 1];
            $lastCell.remove();
        }
    }
}

export { Table }