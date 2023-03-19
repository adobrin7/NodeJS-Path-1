import { Table } from "./Table.js";
import { ControlViewManager } from "./ControlViewManager.js";

const table = new Table(document.querySelector('table'));
const tableControls = new ControlViewManager(table);
