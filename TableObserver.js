export class TableObserver {
    $table = null;
    controlsLayout = null;

    mutationObserver = null;

    constructor($table, controlsLayout) {
        this.$table = $table;
        this.controlsLayout = controlsLayout;

        this.controlsLayout.layoutCreationControls();

        this.mutationObserver = new MutationObserver(() => this.onStructureChanged());
        this.mutationObserver.observe(this.$table, { childList: true, subtree: true });

        this.$table.addEventListener(
            'pointerover',
            () => this.controlsLayout.layoutDestructionControls()
        );
    }

    onStructureChanged() {
        this.controlsLayout.layoutCreationControls();
        this.controlsLayout.hideDestructionControls();
    }
}