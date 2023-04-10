import { TablePointer } from "./TablePointer.js";
export class TableObserver {
    constructor(table, controlsLayout) {
        this.table = table;
        this.controlsLayout = controlsLayout;
        this.mutationObserver = new MutationObserver(event => this.onStructureChanged(event));
        this.mutationObserver.observe(this.table, { childList: true, subtree: true });
        this.addListeners();
    }
    addListeners() {
        document.addEventListener('pointermove', event => this.pointerEventHandler(event));
        document.addEventListener('pointerup', event => {
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
        document.dispatchEvent(new CustomEvent('tableChanged', {
            detail: {
                isHorizontal: mutation.some(record => { var _a; return ((_a = record.addedNodes[0]) === null || _a === void 0 ? void 0 : _a.nodeName) === 'TD'; }),
                isDestruction: mutation.some(record => record.addedNodes.length === 0)
            }
        }));
    }
}
