import { ControlElement } from '../controls/ControlElement.js';
import { TableControlsLayout } from '../controls/TableControlsLayout.js';
import { TableObserver } from '../table/TableObserver.js';

export class InteractiveTable {
    interactiveArea = null;

    constructor(table, interactiveAreaOffset) {
        const addRowControl = new ControlElement('table-control add-control', '+', () => table.addRow());
        const removeRowControl = new ControlElement('table-control remove-control', '-', () => table.removeRow());
        const addColControl = new ControlElement('table-control add-control', '+', () => table.addCol());
        const removeColControl = new ControlElement('table-control remove-control', '-', () => table.removeCol());

        const tableControlsLayout = new TableControlsLayout(
            addRowControl,
            removeRowControl,
            addColControl,
            removeColControl,
            table,
            interactiveAreaOffset
        );

        tableControlsLayout.hideDestructionControls();
        tableControlsLayout.hideCreationControls();

        new TableObserver(table.$table, tableControlsLayout, interactiveAreaOffset);
    }
}