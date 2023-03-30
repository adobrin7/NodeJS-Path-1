import { ControlElement } from './ControlElement.js';
import { TableControlsLayout } from './TableControlsLayout.js';
import { TableObserver } from './TableObserver.js';

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
            table
        );

        tableControlsLayout.hideDestructionControls();
        tableControlsLayout.hideCreationControls();

        new TableObserver(table.$table, tableControlsLayout, interactiveAreaOffset);
    }
}