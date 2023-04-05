import { ControlElement } from '../controls/ControlElement.js';
import { TableControlsLayout } from '../controls/TableControlsLayout.js';
import { Table } from './Table.js';
import { TableObserver } from './TableObserver.js';

export class InteractiveTable {
    constructor(table: Table, interactiveAreaOffset: number) {
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

        tableControlsLayout.hideControls();

        new TableObserver(table.tableElement, tableControlsLayout, interactiveAreaOffset);
    }
}