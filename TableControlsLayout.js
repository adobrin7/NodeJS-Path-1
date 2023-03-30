import { CreationControlsLayout } from './CreationControlsLayout.js';
import { DestructionControlsLayout } from './DestructionControlsLayout.js';

export class TableControlsLayout {
    addRowControl = null;
    removeRowControl = null;
    addColControl = null;
    removeColControl = null;

    $table = null;

    creationControlsLayout = null;
    destructionControlsLayout = null;

    constructor(
        addRowControl,
        removeRowControl,
        addColControl,
        removeColControl,
        table
    ) {
        this.addRowControl = addRowControl;
        this.removeRowControl = removeRowControl;
        this.addColControl = addColControl;
        this.removeColControl = removeColControl;

        this.table = table;

        this.initControlsLayout();
    }

    initControlsLayout() {
        this.creationControlsLayout = new CreationControlsLayout(
            this.addRowControl,
            this.addColControl,
            this.table.$table,
            this.table
        );

        this.destructionControlsLayout = new DestructionControlsLayout(
            this.removeRowControl,
            this.removeColControl,
            this.table.$table,
            this.table
        );
    }

    hideDestructionControls() {
        this.removeRowControl.hide();
        this.removeColControl.hide();
    }

    hideCreationControls() {
        this.addRowControl.hide();
        this.addColControl.hide();
    }

    layoutDestructionControls(event, observeAreaCoords) {
        this.destructionControlsLayout.layout(event, observeAreaCoords);
    }

    layoutCreationControls(event, observeAreaCoords) {
        this.creationControlsLayout.layout(event, observeAreaCoords);
    }
}