import { Table } from './table/Table.js';
import { InteractiveTable } from './table/InteractiveTable.js';

const table = new Table(4, 4, document.querySelector('.table-wrapper'));

new InteractiveTable(table, 40);