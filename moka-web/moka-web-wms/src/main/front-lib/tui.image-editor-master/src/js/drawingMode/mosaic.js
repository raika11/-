/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview MosaicDrawingMode class
 */
import DrawingMode from '../interface/drawingMode';
import { drawingModes, componentNames as components } from '../consts';

/**
 * MosaicDrawingMode class
 * @class
 * @ignore
 */
class MosaicDrawingMode extends DrawingMode {
    constructor() {
        super(drawingModes.MOSAIC);
    }

    /**
     * start this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    start(graphics) {
        const mosaic = graphics.getComponent(components.MOSAIC);
        mosaic.start();
    }

    /**
     * stop this drawing mode
     * @param {Graphics} graphics - Graphics instance
     * @override
     */
    end(graphics) {
        const mosaic = graphics.getComponent(components.MOSAIC);
        mosaic.end();
    }
}

export default MosaicDrawingMode;
