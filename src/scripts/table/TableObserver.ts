import { TableControlsLayout } from "../controls/TableControlsLayout.js";

export class TableObserver {
    private readonly table: HTMLTableElement;
    private readonly controlsLayout: TableControlsLayout;
    private readonly observeAreaOffset: number;

    private readonly mutationObserver: MutationObserver;

    private observeAreaCoords?: { top: number, left: number, right: number, bottom: number };

    constructor(table: HTMLTableElement, controlsLayout: TableControlsLayout, observeAreaOffset: number) {
        this.table = table;
        this.controlsLayout = controlsLayout;
        this.observeAreaOffset = observeAreaOffset;

        this.mutationObserver = new MutationObserver(event => this.onStructureChanged(event));
        this.mutationObserver.observe(this.table, { childList: true, subtree: true });

        this.calcObserveArea();

        document.addEventListener(
            'pointermove',
            event => this.pointerEventHandler(event)
        );

        document.addEventListener(
            'pointerup',
            event => {
                const target = event.target as HTMLElement;
                if (!target.classList.contains('table-control'))
                    return;
                this.pointerEventHandler(event);
            }
        );
    }

    private pointerEventHandler(event: PointerEvent): void {
        if (!this.isPointerInObserveArea(event)) {
            this.controlsLayout.hideControls();
            return;
        }
        this.controlsLayout.layout(event);
    }

    private calcObserveArea(): void {
        const tableCoords = this.table.getBoundingClientRect();
        this.observeAreaCoords = {
            top: tableCoords.top - this.observeAreaOffset,
            left: tableCoords.left - this.observeAreaOffset,
            right: tableCoords.right + this.observeAreaOffset,
            bottom: tableCoords.bottom + this.observeAreaOffset,
        };
    }

    isPointerInObserveArea(pointer: PointerEvent): boolean {
        return pointer.pageX > this.observeAreaCoords!.left &&
            pointer.pageX < this.observeAreaCoords!.right &&
            pointer.pageY > this.observeAreaCoords!.top &&
            pointer.pageY < this.observeAreaCoords!.bottom;
    }

    onStructureChanged(mutation: MutationRecord[]) {
        this.calcObserveArea();
        if (mutation[0].addedNodes.length === 0) {
            return;
        }
        this.controlsLayout.hideCreationControls();
    }
}