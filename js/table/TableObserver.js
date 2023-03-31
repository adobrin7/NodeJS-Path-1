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

        this.mutationObserver = new MutationObserver((event) => this.onStructureChanged(event));
        this.mutationObserver.observe(this.$table, { childList: true, subtree: true });

        this.calcObserveArea();

        document.addEventListener(
            'pointermove',
            event => this.pointerEventHandler(event)
        );

        document.addEventListener(
            'pointerdown', 
            event => setTimeout(
                () => {
                    if (!event.target.classList.contains('table-control'))
                        return;
                    this.pointerEventHandler(event);
                }, 
                125
            )
        );
    }

    pointerEventHandler(event) {
        if (!this.isPointerInObserveArea(event)) {
            this.controlsLayout.hideControls();
            return;
        }
        this.calcObserveArea();
        this.controlsLayout.layout(event, this.observeAreaCoords);
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

    onStructureChanged(mutation) {
        if (mutation[0].addedNodes.length === 0) {
            return;
        }
        this.controlsLayout.hideCreationControls();
    }
}