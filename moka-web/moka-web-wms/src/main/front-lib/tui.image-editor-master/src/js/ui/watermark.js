import Submenu from './submenuBase';
import Range from './tools/range';
import { assignmentForDestroy, isSupportFileApi } from '../util';
import templateHtml from './template/submenu/watermark';
import { defaultOpacityValus } from '../consts';
/**
 * Watermark ui class
 * @class
 * @ignore
 */
class Watermark extends Submenu {
    constructor(subMenuElement, { locale, makeSvgIcon, menuBarPosition, usageStatistics, etc }) {
        super(subMenuElement, {
            locale,
            name: 'watermark',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics,
        });

        this._els = {
            opacityRange: new Range(
                {
                    slider: this.selector('.tie-opacity-range'),
                    input: this.selector('.tie-opacity-range-value'),
                },
                defaultOpacityValus
            ),

            watermarkImageButton: this.selector('.tie-watermark-image-file'),
            watermarkImageSelectbox: this.selector('.tui-image-editor-selectbox'),
            watermarksWapper: this.selector('.tie-image-watermarks-wrap'),
        };

        this._watermarkList = etc.watermark;
        this._menuBarPosition = menuBarPosition;
        if (typeof this._watermarkList !== 'undefined') {
            let selectboxOption = '';
            this._watermarkList.forEach((item, key) => {
                selectboxOption += `<option value="${key}">${item.title}</option>`;
            });
            this._els.watermarkImageSelectbox.innerHTML = selectboxOption;
            this._addWatermarks(0);
        } else {
            this._els.watermarkImageSelectbox.style.display = 'none';
            const partition = document.querySelectorAll(
                '.tui-image-editor-menu-watermark .tui-image-editor-partition'
            );
            partition.forEach(item => {
                item.classList.add('hidden-partition');
            });
        }
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        this._els.opacityRange.destroy();
        assignmentForDestroy(this);
    }

    /**
     * Add event for watermark
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.loadImageFromURL - load image action
     *   @param {Function} actions.applyFilter - apply filter action
     */
    addEvent(actions) {
        const loadWatermarkFile = this._loadWatermarkFile.bind(this);
        this.eventHandler = {
            loadWatermarkFile,
        };

        this.actions = actions;
        this._els.watermarkImageButton.addEventListener('change', loadWatermarkFile);
        this._els.watermarkImageSelectbox.addEventListener(
            'change',
            this._changeWatermarkSelectboxHandler.bind(this)
        );
        this._els.watermarksWapper.addEventListener('click', this._addWatermark.bind(this));
        this._els.opacityRange.on('change', this._changeOpacityRangeHandler.bind(this));
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.watermarkImageButton.removeEventListener('change', this.eventHandler.loadWatermarkFile);
        this._els.watermarkImageSelectbox.removeEventListener(
            'change',
            this._changeWatermarkSelectboxHandler.bind(this)
        );
        this._els.watermarksWapper.removeEventListener('click', this._addWatermark.bind(this));
        this._els.opacityRange.off();
    }

    /**
     * Load watermark file
     * @param {object} event - File change event object
     * @private
     */
    _loadWatermarkFile(event) {
        let imgUrl;

        if (!isSupportFileApi()) {
            alert('This browser does not support file-api');
        }

        const [file] = event.target.files;

        if (file) {
            imgUrl = URL.createObjectURL(file);
            this.actions.addImageObject(imgUrl, file);
        }
    }

    _changeWatermarkSelectboxHandler(event) {
        this._addWatermarks(event.target.value);
    }

    _addWatermarks(value) {
        const watermarks = this._watermarkList[value].image;
        let watermarkHtml = '';
        watermarks.forEach((item, index) => {
            if (
                (this._menuBarPosition == 'top' || this._menuBarPosition == 'bottom') &&
                watermarks.length / 2 == index
            ) {
                watermarkHtml += '<div class="tui-image-editor-newline"></div>';
            }
            watermarkHtml += `<div class="tui-image-add-button tui-image-add-watermark"><img src="${item.path}" alt="${item.name}" title="${item.name}"></div>`;
        });
        this._els.watermarksWapper.innerHTML = watermarkHtml;
    }

    _addWatermark(event) {
        this.actions.addImageObject(event.target.currentSrc);
    }

    _changeOpacityRangeHandler(opacity) {
        this._els.opacityRange.value = opacity;
        this.actions.changeOpacityRangeHandler(opacity);
    }
}

export default Watermark;
