export class TableObserver {
    $table = null;
    controlsLayout = null;
    observeAreaOffset = null;

    mutationObserver = null;

    observeAreaCoords = null;

    constructor($table, controlsLayout, observeAreaOffset) {
        this.$table = $table;
        this.controlsLayout = controlsLayout;
        this.observeAreaOffset = observeAreaOffset;

        this.mutationObserver = new MutationObserver(() => this.onStructureChanged());
        this.mutationObserver.observe(this.$table, { childList: true, subtree: true });

        this.calcObserveArea();

        document.addEventListener(
            'pointermove',
            event => {
                if (!this.isPointerInObserveArea(event)) {
                    this.controlsLayout.hideDestructionControls();
                    this.controlsLayout.hideCreationControls();
                    return;
                }
                this.calcObserveArea();
                this.controlsLayout.layoutDestructionControls(event, this.observeAreaCoords);
                this.controlsLayout.layoutCreationControls(event, this.observeAreaCoords);
            }
        );
    }

    calcObserveArea() {
        const tableCoords = this.$table.getBoundingClientRect();
        this.observeAreaCoords = {
            top: tableCoords.top - this.observeAreaOffset,
            left: tableCoords.left - this.observeAreaOffset,
            right: tableCoords.right + this.observeAreaOffset,
            bottom: tableCoords.bottom + this.observeAreaOffset,
        };
    }

    isPointerInObserveArea(pointer) {
        return pointer.pageX > this.observeAreaCoords.left &&
            pointer.pageX < this.observeAreaCoords.right &&
            pointer.pageY > this.observeAreaCoords.top &&
            pointer.pageY < this.observeAreaCoords.bottom;
    }

    onStructureChanged() {
        this.controlsLayout.hideCreationControls();
    }
}