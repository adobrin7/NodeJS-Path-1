import { Table } from './table/Table.js';
import { InteractiveTable } from './table/InteractiveTable.js';
const table = new Table(document.querySelector('.table-wrapper'), 4, 4);
new InteractiveTable(table);
