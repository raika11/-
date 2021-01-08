/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview change a mosaic
 */
import snippet from 'tui-code-snippet';
import { Promise } from '../util';
import commandFactory from '../factory/command';
import { componentNames, rejectMessages, commandNames } from '../consts';

const { MOSAIC } = componentNames;

/**
 * Chched data for undo
 * @type {Object}
 */
let chchedUndoDataForSilent = null;

/**
 * Make undoData
 * @param {object} options - mosaic options
 * @param {Component} targetObj - mosaic component
 * @returns {object} - undo data
 */
function makeUndoData(options, targetObj) {
    const undoData = {
        object: targetObj,
        options: {},
    };

    snippet.forEachOwnProperties(options, (value, key) => {
        undoData.options[key] = targetObj[key];
    });

    return undoData;
}

const command = {
    name: commandNames.CHANGE_MOSAIC,

    /**
     * Change a mosaic
     * @param {Graphics} graphics - Graphics instance
     * @param {number} id - object id
     * @param {Object} options - Mosaic options
     *      @param {string} [options.fill] - mosaic foreground color (ex: '#fff', 'transparent')
     *      @param {string} [options.stroke] - mosaic outline color
     *      @param {number} [options.strokeWidth] - mosaic outline width
     *      @param {number} [options.mosaicValue] - mosaic value
     *      @param {number} [options.width] - Width value (When type option is 'rect', this options can use)
     *      @param {number} [options.height] - Height value (When type option is 'rect', this options can use)
     *      @param {number} [options.rx] - Radius x value (When type option is 'circle', this options can use)
     *      @param {number} [options.ry] - Radius y value (When type option is 'circle', this options can use)
     *      @param {number} [options.left] - Mosaic x position
     *      @param {number} [options.top] - Mosaic y position
     *      @param {number} [options.isRegular] - Whether resizing mosaic has 1:1 ratio or not
     * @param {boolean} isSilent - is silent execution or not
     * @returns {Promise}
     */
    execute(graphics, id, options, isSilent) {
        const mosaicComp = graphics.getComponent(MOSAIC);
        const targetObj = graphics.getObject(id);

        if (!targetObj) {
            return Promise.reject(rejectMessages.noObject);
        }

        if (!this.isRedo) {
            const undoData = makeUndoData(options, targetObj);

            chchedUndoDataForSilent = this.setUndoData(undoData, chchedUndoDataForSilent, isSilent);
        }

        return mosaicComp.change(targetObj, options);
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        const mosaicComp = graphics.getComponent(MOSAIC);
        const { object: mosaic, options } = this.undoData;

        return mosaicComp.change(mosaic, options);
    },
};

commandFactory.register(command);

export default command;
