import { TablePointer } from "./TablePointer.js";
import { TableEvents } from "../enums/TableEvents.js";
import { ObservedElementTags } from "../enums/ObservedElementTags.js";
export class TableObserver {
    constructor(table, controlsLayout) {
        this.table = table;
        this.controlsLayout = controlsLayout;
        this.mutationObserver = new MutationObserver(event => this.onStructureChanged(event));
        this.mutationObserver.observe(this.table, { childList: true, subtree: true });
        this.addListeners();
    }
    addListeners() {
        document.addEventListener(TableEvents.POINTER_MOVE, event => this.pointerEventHandler(event));
        document.addEventListener(TableEvents.POINTER_UP, event => {
            const target = event.target;
            if (!target.classList.contains('table-control'))
                return;
            this.pointerEventHandler(event);
        });
    }
    pointerEventHandler(event) {
        const tablePointer = new TablePointer(this.table, event);
        if (!tablePointer.isInObserveArea()) {
            this.controlsLayout.hideControls();
            return;
        }
        this.controlsLayout.layout(tablePointer);
    }
    onStructureChanged(mutation) {
        this.controlsLayout.showControls();
        document.dispatchEvent(new CustomEvent(TableEvents.TABLE_CHANGED, {
            detail: {
                isHorizontal: mutation.some(record => { var _a; return ((_a = record.addedNodes[0]) === null || _a === void 0 ? void 0 : _a.nodeName) === ObservedElementTags.TD; }),
                isDestruction: mutation.some(record => record.addedNodes.length === 0)
            }
        }));
    }
}
