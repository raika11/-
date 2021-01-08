import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/resize';
import { assignmentForDestroy } from '../util';
import { defaultResizeRangeValus } from '../consts';

/**
 * resize ui class
 * @class
 * @ignore
 */
class Resize extends Submenu {
    constructor(subMenuElement, { locale, makeSvgIcon, menuBarPosition, usageStatistics }) {
        super(subMenuElement, {
            locale,
            name: 'resize',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics,
        });
        this.status = 'active';
        this._els = {
            resizeRange: new Range(
                {
                    slider: this.selector('.tie-resize-range'),
                    input: this.selector('.tie-resize-range-value'),
                },
                defaultResizeRangeValus
            ),
            width: this.selector('.tie-resize-edit .resize-width'),
            height: this.selector('.tie-resize-edit .resize-height'),
            apply: this.selector('.tie-resize-button .apply'),
            cancel: this.selector('.tie-resize-button .cancel'),
        };
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        this._els.resizeRange.destroy();
        assignmentForDestroy(this);
    }

    _setRangeBarSize(size) {
        this._els.resizeRange.value = size;
        this._changeResizeRangeHandler(size);
    }

    /**
     * Add event for resize
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.resize - resize action
     *   @param {Function} actions.setSize - set angle action
     */
    addEvent(actions) {
        const apply = this._applyEventHandler.bind(this);
        const cancel = this._cancelEventHandler.bind(this);

        this.eventHandler = {
            apply,
            cancel,
        };

        this.actions = actions;
        this._els.width.addEventListener('change', this._changeResizeWidthHandler.bind(this));
        this._els.height.addEventListener('change', this._changeResizeHeightHandler.bind(this));
        this._els.resizeRange.on('change', this._changeResizeRangeHandler.bind(this));
        this._els.apply.addEventListener('click', apply);
        this._els.cancel.addEventListener('click', cancel);
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.width.removeEventListener('change', this._changeResizeWidthHandler.bind(this));
        this._els.height.removeEventListener('change', this._changeResizeHeightHandler.bind(this));
        this._els.apply.removeEventListener('click', this.eventHandler.apply);
        this._els.cancel.removeEventListener('click', this.eventHandler.cancel);
        this._els.resizeRange.off();
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.actions.modeChange('resize');
        this._setRangeBarSize(100);
    }

    /**
     * Change resize for range
     * @param {number} value - size value
     * @private
     */
    _changeResizeRangeHandler(value) {
        const imageSize = this.actions.getResizeImageSize(value);
        this._els.width.value = imageSize.width;
        this._els.height.value = imageSize.height;
        this.actions.changeImageSize(imageSize.width, imageSize.height);
    }

    _changeResizeWidthHandler(event) {
        const type = 'width';
        const value = event.target.value;
        const imageSize = this.actions.getResizeImageSize(value, type);
        this._els.width.value = imageSize.width;
        this._els.height.value = imageSize.height;
        this.actions.changeImageSize(imageSize.width, imageSize.height);
    }

    _changeResizeHeightHandler(event) {
        const type = 'height';
        const value = event.target.value;
        const imageSize = this.actions.getResizeImageSize(value, type);
        this._els.width.value = imageSize.width;
        this._els.height.value = imageSize.height;
        this.actions.changeImageSize(imageSize.width, imageSize.height);
    }
    _applyEventHandler() {
        this.actions.resizeCanvasImage(this._els.width.value, this._els.height.value);
        this._els.apply.classList.remove('active');
    }

    _cancelEventHandler() {
        this.actions.cancel();
        this._els.apply.classList.remove('active');
    }
}

export default Resize;
