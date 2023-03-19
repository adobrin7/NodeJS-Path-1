class ControlRender {
    constructor(rowControl, colControl, $table) {
        this.rowControl = rowControl;
        this.colControl = colControl;
        this.$table = $table;
        this.tableBodyTableContentDiff = Math.max(
            this.$table.firstElementChild.offsetLeft,
            this.$table.firstElementChild.offsetTop
        );
    }

    render() {}
}

export { ControlRender };