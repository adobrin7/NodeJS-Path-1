import { ControlsLayout } from "../controls/ControlsLayout.js";
import { TablePointer } from "./TablePointer.js";
import { TableEvents } from "../enums/TableEvents.js";
import { ObservedElementTags } from "../enums/ObservedElementTags.js";

export class TableObserver {
    private readonly table: HTMLTableElement;
    private readonly controlsLayout: ControlsLayout;
    private readonly mutationObserver: MutationObserver;

    constructor(table: HTMLTableElement, controlsLayout: ControlsLayout) {
        this.table = table;
        this.controlsLayout = controlsLayout;

        this.mutationObserver = new MutationObserver(event => this.onStructureChanged(event));
        this.mutationObserver.observe(this.table, { childList: true, subtree: true });

        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener(
            TableEvents.POINTER_MOVE,
            event => this.pointerEventHandler(event)
        );

        document.addEventListener(
            TableEvents.POINTER_UP,
            event => {
                const target = event.target as HTMLElement;
                if (!target.classList.contains('table-control'))
                    return;
                this.pointerEventHandler(event);
            }
        );
    }

    private pointerEventHandler(event: PointerEvent): void {
        const tablePointer = new TablePointer(this.table, event);
        if (!tablePointer.isInObserveArea()) {
            this.controlsLayout.hideControls();
            return;
        }
        this.controlsLayout.layout(tablePointer);
    }

    onStructureChanged(mutation: MutationRecord[]): void {
        this.controlsLayout.showControls();
        document.dispatchEvent(
            new CustomEvent(
                TableEvents.TABLE_CHANGED, 
                { 
                    detail: { 
                    isHorizontal: mutation.some(record => record.addedNodes[0]?.nodeName === ObservedElementTags.TD), 
                    isDestruction: mutation.some(record => record.addedNodes.length === 0)
                }
            })
        );
    }
}