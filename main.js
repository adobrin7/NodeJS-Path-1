import { Table } from './Table.js';
import { InteractiveTable } from './InteractiveTable.js';

const table = new Table(4, 4, document.querySelector('.table-wrapper'));

new InteractiveTable(table, 40);