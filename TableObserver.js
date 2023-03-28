export class TableObserver {
    $table = null;
    controlsLayout = null;
    observeAreaCoords = null;

    mutationObserver = null;

    constructor($table, controlsLayout, observeAreaCoords) {
        this.$table = $table;
        this.controlsLayout = controlsLayout;
        this.observeAreaCoords = observeAreaCoords;

        this.controlsLayout.layoutCreationControls();

        this.mutationObserver = new MutationObserver(() => this.onStructureChanged());
        this.mutationObserver.observe(this.$table, { childList: true, subtree: true });

        document.addEventListener(
            'pointermove',
            event => {
                if (!this.isPointerInObserveArea(event)) {
                    this.controlsLayout.hideDestructionControls();
                    return;
                }
                this.controlsLayout.layoutDestructionControls(event, observeAreaCoords);
            }
        );
    }

    isPointerInObserveArea(pointer) {
        return pointer.pageX > this.observeAreaCoords.left &&
            pointer.pageX < this.observeAreaCoords.right &&
            pointer.pageY > this.observeAreaCoords.top &&
            pointer.pageY < this.observeAreaCoords.bottom;
    }

    onStructureChanged() {
        this.controlsLayout.layoutCreationControls();
        this.controlsLayout.hideDestructionControls();
    }
}