import { AddControlsRender } from "./AddControlsRender.js";
import { RemoveControlsRender } from "./RemoveControlsRender.js";
import { TableControl } from "./TableControl.js";

class ControlViewManager {
    constructor(table) {
        this.table = table;
        this.createControls();
        this.renderAddControls();
        this.renderRemoveControls();

        new MutationObserver(() => this.renderAddControls())
            .observe(table.$table, { childList: true, subtree: true });
    }

    createControls() {
        this.createAddControls();
        this.createRemoveControls();
    }

    createAddControls() {
        this.addRowControl = new TableControl(
            'table-control add-control', // TODO:
            '+',
            () => this.table.addRow()
        );
        this.addColumnControl = new TableControl(
            'table-control add-control',
            '+',
            () => this.table.addCol()
        );
    }

    createRemoveControls() {
        this.removeRowControl = new TableControl(
            'table-control remove-control', // TODO:
            '-',
            () => this.table.removeRow()
        );
        this.removeColControl = new TableControl(
            'table-control remove-control',
            '-',
            () => this.table.removeCol()
        );
        this.removeRowControl.hide();
        this.removeColControl.hide();
    }

    renderAddControls() {
        new AddControlsRender(
            this.addRowControl,
            this.addColumnControl,
            this.table.$table
        ).render();
    }

    renderRemoveControls() {
        this.table.$table.addEventListener(
            'pointerover',
            () => new RemoveControlsRender(
                this.removeRowControl,
                this.removeColControl,
                this.table.$table
            ).render()
        );
    }
}

export { ControlViewManager }
