import { ControlElement } from '../controls/ControlElement.js';
import { ControlsLayout } from '../controls/ControlsLayout.js';
import { Table } from './Table.js';
import { TableObserver } from './TableObserver.js';

export class InteractiveTable {
    constructor(table: Table) {
        const addRowControl = new ControlElement('table-control add-control', '+', () => table.addRow());
        const removeRowControl = new ControlElement('table-control remove-control', '-', () => table.removeRow());
        const addColControl = new ControlElement('table-control add-control', '+', () => table.addCol());
        const removeColControl = new ControlElement('table-control remove-control', '-', () => table.removeCol());

        const tableControlsLayout = new ControlsLayout(
            addRowControl,
            removeRowControl,
            addColControl,
            removeColControl,
            table
        );

        tableControlsLayout.hideControls();

        new TableObserver(table.tableElement, tableControlsLayout);
    }
}