/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Watermark component
 */
import Component from '../interface/component';
import { componentNames } from '../consts';
import { Promise } from '../util';

/**
 * Watermark
 * @class Watermark
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
export default class Watermark extends Component {
    constructor(graphics) {
        super(componentNames.WATERMARK, graphics);
    }

    /**
     * Change the watermark
     * @ignore
     * @param {fabric.Object} watermarkObj - Selected watermark object on canvas
     * @param {Object} options - watermark options
     *      @param {string} [options.opacity] - watermark opacity
     * @returns {Promise}
     */
    change(watermarkObj, options) {
        return new Promise(resolve => {
            watermarkObj.set({ opacity: options * 0.1 });
            this.getCanvas().renderAll();
            resolve();
        });
    }
}
