/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview change a opacity
 */
import snippet from 'tui-code-snippet';
import { Promise } from '../util';
import commandFactory from '../factory/command';
import { componentNames, rejectMessages, commandNames } from '../consts';

const { WATERMARK } = componentNames;

/**
 * Chched data for undo
 * @type {Object}
 */
let chchedUndoDataForSilent = null;

/**
 * Make undoData
 * @param {object} options - watermark options
 * @param {Component} targetObj - watermark component
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
    name: commandNames.CHANGE_WATERMARK_OPACITY,

    /**
     * Change a watermark opacity
     * @param {Graphics} graphics - Graphics instance
     * @param {number} id - object id
     * @param {Object} options - watermark options
     *      @param {string} [options.opacity] - watermark opacity
     * @param {boolean} isSilent - is silent execution or not
     * @returns {Promise}
     */
    execute(graphics, id, options, isSilent) {
        const watermarkComp = graphics.getComponent(WATERMARK);
        const targetObj = graphics.getObject(id);

        if (!targetObj) {
            return Promise.reject(rejectMessages.noObject);
        }

        if (!this.isRedo) {
            const undoData = makeUndoData(options, targetObj);

            chchedUndoDataForSilent = this.setUndoData(undoData, chchedUndoDataForSilent, isSilent);
        }

        return watermarkComp.change(targetObj, options);
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        const watermarkComp = graphics.getComponent(watermarkComp);
        const { object: watermark, options } = this.undoData;

        return watermarkComp.change(watermark, options);
    },
};

commandFactory.register(command);

export default command;
