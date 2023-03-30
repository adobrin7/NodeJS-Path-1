import { Table } from './Table.js';
import { InteractiveTable } from './InteractiveTable.js';

const table = new Table(document.querySelector('table'));

new InteractiveTable(table, 40);