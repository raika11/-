import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/mosaic';
import { toInteger, assignmentForDestroy } from '../util';
import { defaultMosaicValus } from '../consts';

const MOSAIC_DEFAULT_OPTION = {
    mosaicValue: 10,
    item: 'mosaic',
    stroke: '#fff',
    strokeWidth: 2,
    fill: 'transparent',
};

/**
 * Mosaic ui class
 * @class
 * @ignore
 */
class Mosaic extends Submenu {
    constructor(subMenuElement, { locale, makeSvgIcon, menuBarPosition, usageStatistics }) {
        super(subMenuElement, {
            locale,
            name: 'mosaic',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics,
        });
        this.type = null;
        this.options = MOSAIC_DEFAULT_OPTION;

        this._els = {
            mosaicSelectButton: this.selector('.tie-mosaic-button'),
            mosaicRange: new Range(
                {
                    slider: this.selector('.tie-mosaic-range'),
                    input: this.selector('.tie-mosaic-range-value'),
                },
                defaultMosaicValus
            ),
        };
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        this._els.mosaicRange.destroy();

        assignmentForDestroy(this);
    }

    /**
     * Add event for mosaic
     * @param {Object} actions - actions for mosaic
     *   @param {Function} actions.changeMosaic - change mosaic mode
     *   @param {Function} actions.setDrawingMosaic - set dreawing mosaic
     */
    addEvent(actions) {
        this.eventHandler.mosaicTypeSelected = this._changeMosaicHandler.bind(this);
        this.actions = actions;

        this._els.mosaicSelectButton.addEventListener('click', this.eventHandler.mosaicTypeSelected);
        this._els.mosaicRange.on('change', this._changeMosaicRangeHandler.bind(this));
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.mosaicSelectButton.removeEventListener('click', this.eventHandler.mosaicTypeSelected);
        this._els.mosaicRange.off();
    }

    /**
     * Set Mosaic status
     * @param {Object} options - options of mosaic status
     *   @param {string} mosaicValue - mosaic value
     */
    setMosaicStatus({ mosaicValue }) {
        this._els.mosaicRange.value = mosaicValue;
        this.options.mosaicValue = mosaicValue;
        this.actions.setDrawingMosaic(this.type, { mosaicValue });
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.actions.stopDrawingMode();
    }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.type = null;
        this.actions.changeSelectableAll(true);
        this._els.mosaicSelectButton.classList.remove('circle');
        this._els.mosaicSelectButton.classList.remove('rect');
    }

    /**
     * set range mosaic max value
     */
    setMaxMosaicValue() {
        this._els.mosaicRange.max = defaultMosaicValus.max;
    }

    /**
     * Set mosaic value
     * @param {number} value - expect value for mosaic range change
     */
    setMosaicValue(value) {
        this._els.mosaicRange.value = value;
        this._els.mosaicRange.trigger('change');
    }

    /**
     * Get mosaic value
     * @returns {number} - mosaic range value
     */
    getMosaicValue() {
        return this._els.mosaicRange.value;
    }

    /**
     * Change icon color
     * @param {object} event - add button event object
     * @private
     */
    _changeMosaicHandler(event) {
        const button = event.target.closest('.tui-image-editor-button');
        if (button) {
            this.actions.stopDrawingMode();
            this.actions.discardSelection();
            const mosaicType = this.getButtonType(button, ['circle', 'rect']);

            if (this.type === mosaicType) {
                this.changeStandbyMode();

                return;
            }
            this.changeStandbyMode();
            this.type = mosaicType;
            event.currentTarget.classList.add(mosaicType);
            this.actions.changeSelectableAll(false);
            this.actions.modeChange('mosaic');
        }
    }

    /**
     * Change mosaic range
     * @param {number} value - mosaic range value
     * @param {boolean} isLast - Is last change
     * @private
     */
    _changeMosaicRangeHandler(value, isLast) {
        // eslint-disable-next-line no-console
        this.options.mosaicValue = toInteger(value);
        this.actions.changeMosaic(
            {
                mosaicValue: value,
            },
            !isLast
        );

        this.actions.setDrawingMosaic(this.type, this.options);
    }
}

export default Mosaic;
