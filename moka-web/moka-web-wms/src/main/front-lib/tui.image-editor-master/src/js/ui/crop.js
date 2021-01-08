import snippet from 'tui-code-snippet';
import Submenu from './submenuBase';
import { assignmentForDestroy } from '../util';
import templateHtml from './template/submenu/crop';

/**
 * Crop ui class
 * @class
 * @ignore
 */
class Crop extends Submenu {
    constructor(subMenuElement, { locale, makeSvgIcon, menuBarPosition, usageStatistics, etc }) {
        super(subMenuElement, {
            locale,
            name: 'crop',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics,
        });

        this.status = 'active';
        this.userCropSize = etc.crop;

        this._els = {
            apply: this.selector('.tie-crop-button .apply'),
            cancel: this.selector('.tie-crop-button .cancel'),
            preset: this.selector('.tie-crop-preset-button'),
            width: this.selector('.image-size .crop-width'),
            height: this.selector('.image-size .crop-height'),
        };

        this.defaultPresetButton = this._els.preset.querySelector('.preset-0');
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();

        assignmentForDestroy(this);
    }

    /**
     * Add event for crop
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.crop - crop action
     *   @param {Function} actions.cancel - cancel action
     *   @param {Function} actions.preset - draw rectzone at a predefined ratio
     */
    addEvent(actions) {
        const apply = this._applyEventHandler.bind(this);
        const cancel = this._cancelEventHandler.bind(this);
        const cropzonePreset = this._cropzonePresetEventHandler.bind(this);

        this.eventHandler = {
            apply,
            cancel,
            cropzonePreset,
        };

        this.actions = actions;
        this._els.apply.addEventListener('click', apply);
        this._els.cancel.addEventListener('click', cancel);
        this._els.preset.addEventListener('click', cropzonePreset);
        this._els.width.addEventListener('change', this._changeCropzoneWidthHandler.bind(this));
        this._els.height.addEventListener('change', this._changeCropzoneHeightHandler.bind(this));
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.width.addEventListener('change', this._changeCropzoneWidthHandler.bind(this));
        this._els.height.addEventListener('change', this._changeCropzoneHeightHandler.bind(this));
        this._els.apply.removeEventListener('click', this.eventHandler.apply);
        this._els.cancel.removeEventListener('click', this.eventHandler.cancel);
        this._els.preset.removeEventListener('click', this.eventHandler.cropzonePreset);
    }

    _applyEventHandler() {
        this.actions.crop();
        this._els.apply.classList.remove('active');
    }

    _cancelEventHandler() {
        this.actions.cancel();
        this._els.apply.classList.remove('active');
    }

    _cropzonePresetEventHandler(event) {
        const button = event.target.closest('.tui-image-editor-button.preset');

        if (button) {
            let [presetType] = button.className.match(/preset-[^\s]+/);
            presetType = presetType.replace('preset-', '').replace('-', '/');

            if (presetType === 'none') {
                presetType = 0;
            } else {
                presetType = eval(presetType);
            }
            this._setPresetButtonActive(button);
            this.actions.preset(presetType, this.userCropSize.width, this.userCropSize.height);
        }
        this.onFabricScaling();
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.actions.modeChange('crop');

        if (typeof this.userCropSize === 'undefined') {
            this.userCropSize = this.actions.getCanvasImageSize();
        }

        this.actions.setCustomCropzoneRect(this.userCropSize.width, this.userCropSize.height);

        this.onFabricScaling();
    }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.actions.stopDrawingMode();
        this._setPresetButtonActive();
    }

    /**
     * Change apply button status
     * @param {Boolean} enableStatus - apply button status
     */
    changeApplyButtonStatus(enableStatus) {
        if (enableStatus) {
            this._els.apply.classList.add('active');
        } else {
            this._els.apply.classList.remove('active');
        }
    }

    /**
     * Set preset button to active status
     * @param {HTMLElement} button - event target element
     * @private
     */
    _setPresetButtonActive(button = this.defaultPresetButton) {
        snippet.forEach([].slice.call(this._els.preset.querySelectorAll('.preset')), presetButton => {
            presetButton.classList.remove('active');
        });

        if (button) {
            button.classList.add('active');
        }
    }

    _changeCropzoneWidthHandler(event) {
        const value = parseInt(event.target.value);
        this._els.width.value = value;

        const button = this.selector('.tui-image-editor-button.preset.active');
        let [presetType] = button.className.match(/preset-[^\s]+/);
        presetType = presetType.replace('preset-', '').replace('-', '/');
        if (presetType === 'none') {
            presetType = 0;
        } else {
            presetType = eval(presetType);
        }

        if (presetType !== 0) {
            const type = 'width';
            const cropper = this.actions.getDrwwCropRectSize(value, type, presetType);
            this._els.width.value = cropper.width;
            this._els.height.value = cropper.height;
        } else {
            const cropper = this.actions.getCanvasImageSize();
            this._els.width.value = cropper.width;
        }
        this.actions.setCustomCropzoneRect(parseInt(this._els.width.value), parseInt(this._els.height.value));
    }

    _changeCropzoneHeightHandler(event) {
        const value = parseInt(event.target.value);
        this._els.height.value = value;

        const button = this.selector('.tui-image-editor-button.preset.active');
        let [presetType] = button.className.match(/preset-[^\s]+/);
        presetType = eval(presetType.replace('preset-', '').replace('-', '/'));

        if (presetType === 'none') {
            presetType = 0;
        } else {
            presetType = eval(presetType);
        }

        if (presetType !== 0) {
            const type = 'height';
            const cropper = this.actions.getDrwwCropRectSize(value, type, presetType);
            this._els.width.value = cropper.width;
            this._els.height.value = cropper.height;
        } else {
            const cropper = this.actions.getCanvasImageSize();
            this._els.height.value = cropper.height;
        }
        this.actions.setCustomCropzoneRect(parseInt(this._els.width.value), parseInt(this._els.height.value));
    }

    onFabricScaling() {
        const self = this;
        setTimeout(() => {
            const cropRect = self.actions.getCropzoneRect();
            self._els.width.value = parseInt(cropRect.width);
            self._els.height.value = parseInt(cropRect.height);
        }, 0);
    }
}

export default Crop;
