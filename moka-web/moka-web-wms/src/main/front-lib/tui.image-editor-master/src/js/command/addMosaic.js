/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Add a mosaic
 */
import commandFactory from '../factory/command';
import { Promise } from '../util';
import { componentNames, commandNames } from '../consts';

const { MOSAIC } = componentNames;

const command = {
    name: commandNames.ADD_MOSAIC,

    /**
     * Add a mosaic
     * @param {Graphics} graphics - Graphics instance
     * @param {string} type - Mosaic type (ex: 'rect', 'circle', 'triangle')
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
     * @returns {Promise}
     */
    execute(graphics, type, options) {
        const mosaicComp = graphics.getComponent(MOSAIC);

        return mosaicComp.add(type, options).then(objectProps => {
            this.undoData.object = graphics.getObject(objectProps.id);

            return objectProps;
        });
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        graphics.remove(this.undoData.object);

        return Promise.resolve();
    },
};

commandFactory.register(command);

export default command;
