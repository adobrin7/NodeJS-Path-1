export class ControlsLayout {
    rowControl = null;
    colControl = null;
    $table = null;

    constructor(rowControl, colControl, $table) {
        this.rowControl = rowControl;
        this.colControl = colControl;
        this.$table = $table;

        this.clientOffset = Math.max(
            this.$table.firstElementChild.offsetLeft,
            this.$table.firstElementChild.offsetTop
        );
    }
}