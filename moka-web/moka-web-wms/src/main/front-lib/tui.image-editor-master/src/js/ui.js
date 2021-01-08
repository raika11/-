import snippet from 'tui-code-snippet';
import { HELP_MENUS } from './consts';
import { getSelector, assignmentForDestroy, cls } from './util';
import mainContainer from './ui/template/mainContainer';
import controls from './ui/template/controls';

import Theme from './ui/theme/theme';
import Resize from './ui/resize';
import Shape from './ui/shape';
import Crop from './ui/crop';
import Mosaic from './ui/mosaic';
import Flip from './ui/flip';
import Rotate from './ui/rotate';
import Text from './ui/text';
import Mask from './ui/mask';
import Icon from './ui/icon';
import Watermark from './ui/watermark';
import Draw from './ui/draw';
import Filter from './ui/filter';
import Locale from './ui/locale/locale';
import RangeVertical from './ui/tools/rangeVertical';
import { defaultZoomValus } from './consts';

const SUB_UI_COMPONENT = {
    Resize,
    Shape,
    Crop,
    Flip,
    Rotate,
    Text,
    Mask,
    Icon,
    Draw,
    Filter,
    Mosaic,
    Watermark,
};

const BI_EXPRESSION_MINSIZE_WHEN_TOP_POSITION = '1300';

/**
 * Ui class
 * @class
 * @param {string|HTMLElement} element - Wrapper's element or selector
 * @param {Object} [options] - Ui setting options
 *   @param {number} options.loadImage - Init default load image
 *   @param {number} options.initMenu - Init start menu
 *   @param {Boolean} [options.menuBarPosition=bottom] - Let
 *   @param {Boolean} [options.applyCropSelectionStyle=false] - Let
 *   @param {Boolean} [options.usageStatistics=false] - Use statistics or not
 *   @param {Object} [options.uiSize] - ui size of editor
 *     @param {string} options.uiSize.width - width of ui
 *     @param {string} options.uiSize.height - height of ui
 * @param {Object} actions - ui action instance
 */
class Ui {
    constructor(element, options, actions) {
        this.options = this._initializeOption(options);
        this._actions = actions;
        this.submenu = false;
        this.imageSize = {};
        this.uiSize = {};
        this._locale = new Locale(this.options.locale);
        this.theme = new Theme(this.options.theme);
        this.eventHandler = {};
        this._submenuChangeTransection = false;
        this._selectedElement = null;
        this._mainElement = null;
        this._editorElementWrap = null;
        this._editorElement = null;
        this._menuElement = null;
        this._subMenuElement = null;
        this._els = null;
        this._lowerCanvas = null;
        this._upperCanvas = null;
        this._makeUiElement(element);
        this._setUiSize();
        this._initMenuEvent = false;
        this._makeSubMenu();
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeUiEvent();
        this._destroyAllMenu();
        this._selectedElement.innerHTML = '';

        assignmentForDestroy(this);
    }

    /**
     * Set Default Selection for includeUI
     * @param {Object} option - imageEditor options
     * @returns {Object} - extends selectionStyle option
     * @ignore
     */
    setUiDefaultSelectionStyle(option) {
        return snippet.extend(
            {
                applyCropSelectionStyle: true,
                applyGroupSelectionStyle: true,
                selectionStyle: {
                    cornerStyle: 'circle',
                    cornerSize: 16,
                    cornerColor: '#fff',
                    cornerStrokeColor: '#fff',
                    transparentCorners: false,
                    lineWidth: 2,
                    borderColor: '#fff',
                },
            },
            option
        );
    }

    /**
     * Change editor size
     * @param {Object} resizeInfo - ui & image size info
     *   @param {Object} [resizeInfo.uiSize] - image size dimension
     *     @param {string} resizeInfo.uiSize.width - ui width
     *     @param {string} resizeInfo.uiSize.height - ui height
     *   @param {Object} [resizeInfo.imageSize] - image size dimension
     *     @param {Number} resizeInfo.imageSize.oldWidth - old width
     *     @param {Number} resizeInfo.imageSize.oldHeight - old height
     *     @param {Number} resizeInfo.imageSize.newWidth - new width
     *     @param {Number} resizeInfo.imageSize.newHeight - new height
     * @example
     * // Change the image size and ui size, and change the affected ui state together.
     * imageEditor.ui.resizeEditor({
     *     imageSize: {oldWidth: 100, oldHeight: 100, newWidth: 700, newHeight: 700},
     *     uiSize: {width: 1000, height: 1000}
     * });
     * @example
     * // Apply the ui state while preserving the previous attribute (for example, if responsive Ui)
     * imageEditor.ui.resizeEditor();
     */
    resizeEditor({ uiSize, imageSize = this.imageSize } = {}) {
        if (imageSize !== this.imageSize) {
            this.imageSize = imageSize;
        }
        if (uiSize) {
            this._setUiSize(uiSize);
        }

        const { width, height } = this._getCanvasMaxDimension();
        const editorElementStyle = this._editorElement.style;
        const { menuBarPosition } = this.options;

        editorElementStyle.width = `${width}px`;
        editorElementStyle.height = `${height}px`;

        this._setEditorPosition(menuBarPosition);

        this._editorElementWrap.style.bottom = '0px';
        this._editorElementWrap.style.top = '0px';
        this._editorElementWrap.style.left = '0px';
        this._editorElementWrap.style.width = '100%';

        if (this._lowerCanvas == null) {
            this._lowerCanvas = this._selectedElement.querySelector('.lower-canvas');
        }
        if (this._upperCanvas == null) {
            this._upperCanvas = this._selectedElement.querySelector('.upper-canvas');
        }

        this._lowerCanvas.style.width = '100%';
        this._lowerCanvas.style.height = '100%';

        this._upperCanvas.style.width = '100%';
        this._upperCanvas.style.height = '100%';

        const selectElementClassList = this._selectedElement.classList;

        if (
            menuBarPosition === 'top' &&
            this._selectedElement.offsetWidth < BI_EXPRESSION_MINSIZE_WHEN_TOP_POSITION
        ) {
            selectElementClassList.add('tui-image-editor-top-optimization');
        } else {
            selectElementClassList.remove('tui-image-editor-top-optimization');
        }
        //this.setSizeValue();
    }

    resizeEditorElement(width, height) {
        width = parseInt(width);
        height = parseInt(height);
        this._editorElement.style.width = `${width}px`;
        this._editorElement.style.height = `${height}px`;
        this._editorContainerElement.style.maxWidth = `${width}px`;
        this._editorContainerElement.style.maxHeight = `${height}px`;
        if (this._lowerCanvas == null) {
            this._lowerCanvas = this._selectedElement.querySelector('.lower-canvas');
        }
        if (this._upperCanvas == null) {
            this._upperCanvas = this._selectedElement.querySelector('.upper-canvas');
        }

        this._editorContainerElement.style.width = '100%';
        this._editorContainerElement.style.height = '100%';

        this._lowerCanvas.style.width = '100%';
        this._lowerCanvas.style.height = '100%';

        this._upperCanvas.style.width = '100%';
        this._upperCanvas.style.height = '100%';

        this._lowerCanvas.style.maxWidth = width + 'px';
        this._lowerCanvas.style.maxHeight = height + 'px';

        this._upperCanvas.style.maxWidth = width + 'px';
        this._upperCanvas.style.maxHeight = height + 'px';
    }

    /**
     * Change help button status
     * @param {string} buttonType - target button type
     * @param {Boolean} enableStatus - enabled status
     * @ignore
     */
    changeHelpButtonEnabled(buttonType, enableStatus) {
        const buttonClassList = this._buttonElements[buttonType].classList;

        buttonClassList[enableStatus ? 'add' : 'remove']('enabled');
    }

    /**
     * Change delete button status
     * @param {Object} [options] - Ui setting options
     *   @param {object} [options.loadImage] - Init default load image
     *   @param {string} [options.initMenu] - Init start menu
     *   @param {string} [options.menuBarPosition=bottom] - Let
     *   @param {boolean} [options.applyCropSelectionStyle=false] - Let
     *   @param {boolean} [options.usageStatistics=false] - Send statistics ping or not
     *   @param {object} [options.resize]
     *      *   @param {object} [options.crop] - Let
     * @returns {Object} initialize option
     * @private
     */
    _initializeOption(options) {
        return snippet.extend(
            {
                loadImage: {
                    path: '',
                    name: '',
                },
                locale: {},
                menuIconPath: '',
                menu: [
                    'resize',
                    'crop',
                    'flip',
                    'rotate',
                    'draw',
                    'shape',
                    'icon',
                    'text',
                    'mask',
                    'mosaic',
                    'watermark',
                    'filter',
                ],
                initMenu: '',
                uiSize: {
                    width: '100%',
                    height: '100%',
                },
                menuBarPosition: 'bottom',
                isDownloadButton: false,
            },
            options
        );
    }

    /**
     * Set ui container size
     * @param {Object} uiSize - ui dimension
     *   @param {string} uiSize.width - css width property
     *   @param {string} uiSize.height - css height property
     * @private
     */
    _setUiSize(uiSize = this.options.uiSize) {
        const elementDimension = this._selectedElement.style;
        elementDimension.width = uiSize.width;
        elementDimension.height = uiSize.height;
    }

    /**
     * Make submenu dom element
     * @private
     */
    _makeSubMenu() {
        snippet.forEach(this.options.menu, menuName => {
            const SubComponentClass = SUB_UI_COMPONENT[menuName.replace(/^[a-z]/, $0 => $0.toUpperCase())];

            // make menu element
            this._makeMenuElement(menuName);

            // menu btn element
            this._buttonElements[menuName] = this._menuElement.querySelector(`.tie-btn-${menuName}`);

            // submenu ui instance
            this[menuName] = new SubComponentClass(this._subMenuElement, {
                locale: this._locale,
                makeSvgIcon: this.theme.makeMenSvgIconSet.bind(this.theme),
                menuBarPosition: this.options.menuBarPosition,
                usageStatistics: this.options.usageStatistics,
                etc: this.options.etc,
            });
        });
    }

    /**
     * Make primary ui dom element
     * @param {string|HTMLElement} element - Wrapper's element or selector
     * @private
     */
    _makeUiElement(element) {
        // eslint-disable-next-line no-console
        let selectedElement;

        window.snippet = snippet;

        if (element.nodeType) {
            selectedElement = element;
        } else {
            selectedElement = document.querySelector(element);
        }
        const selector = getSelector(selectedElement);
        let editorTitle = this.options.title;
        if (typeof editorTitle === 'undefined' || editorTitle.length == 0) {
            editorTitle = this.theme.getStyle('common').title;
        }
        let lang = this.options.lang;
        if (typeof lang === 'undefined' || lang.length == 0) {
            lang = this.theme.getStyle('common').lang;
        }
        selectedElement.classList.add('tui-image-editor-container');
        selectedElement.innerHTML =
            controls({
                locale: this._locale,
                title: editorTitle,
                loadButtonStyle: this.theme.getStyle('loadButton'),
                downloadButtonStyle: this.theme.getStyle('downloadButton'),
            }) +
            mainContainer({
                locale: this._locale,
                title: editorTitle,
                commonStyle: this.theme.getStyle('common'),
                headerStyle: this.theme.getStyle('header'),
                loadButtonStyle: this.theme.getStyle('loadButton'),
                applyButtonStyle: this.theme.getStyle('applyButton'),
                downloadButtonStyle: this.theme.getStyle('downloadButton'),
                submenuStyle: this.theme.getStyle('submenu'),
                text: this.theme.getStyle(lang + '.text'),
            });

        this._selectedElement = selectedElement;
        this._selectedElement.classList.add(this.options.menuBarPosition);

        this._mainElement = selector('.tui-image-editor-main');
        this._editorElementWrap = selector('.tui-image-editor-wrap');
        this._editorElement = selector('.tui-image-editor');
        this._lowerCanvas = selector('.lower-canvas');
        this._upperCanvas = selector('.upper-canvas');
        this._menuElement = selector('.tui-image-editor-menu');
        this._subMenuElement = selector('.tui-image-editor-submenu');
        this._buttonElements = {
            apply: this._selectedElement.querySelectorAll('.tui-image-editor-apply-btn'),
            download: this._selectedElement.querySelectorAll('.tui-image-editor-download-btn'),
            load: this._selectedElement.querySelectorAll('.tui-image-editor-load-btn'),
            cancel: this._selectedElement.querySelectorAll('.tui-image-editor-cancel-btn'),
        };

        this._addHelpMenus();

        this._els = {
            zoomRange: new RangeVertical(
                {
                    slider: this._selectedElement.querySelector('.tie-zoom-range'),
                    input: this._selectedElement.querySelector('.tie-zoom-range-value'),
                },
                defaultZoomValus
            ),
        };
        this._els.zoomRange.on('change', this._changeZoomRangeHandler.bind(this));

        if (!this.options.isDownloadButton) {
            this._buttonElements.download.forEach(e => e.parentNode.removeChild(e));
        }
    }

    /**
     * make array for help menu output, including partitions.
     * @returns {Array}
     * @private
     */
    _makeHelpMenuWithPartition() {
        const helpMenuWithPartition = [...HELP_MENUS, ''];
        helpMenuWithPartition.splice(3, 0, '');

        return helpMenuWithPartition;
    }

    /**
     * Add help menu
     * @private
     */
    _addHelpMenus() {
        const helpMenuWithPartition = this._makeHelpMenuWithPartition();

        snippet.forEach(helpMenuWithPartition, menuName => {
            if (!menuName) {
                this._makeMenuPartitionElement();
            } else {
                this._makeMenuElement(menuName, ['normal', 'disabled', 'hover'], 'help');

                if (menuName) {
                    this._buttonElements[menuName] = this._menuElement.querySelector(`.tie-btn-${menuName}`);
                }
            }
        });
    }

    /**
     * Make menu partition element
     * @private
     */
    _makeMenuPartitionElement() {
        const partitionElement = document.createElement('li');
        const partitionInnerElement = document.createElement('div');
        partitionElement.className = cls('item');
        partitionInnerElement.className = cls('icpartition');
        partitionElement.appendChild(partitionInnerElement);

        this._menuElement.appendChild(partitionElement);
    }

    /**
     * Make menu button element
     * @param {string} menuName - menu name
     * @param {Array} useIconTypes - Possible values are  \['normal', 'active', 'hover', 'disabled'\]
     * @param {string} menuType - 'normal' or 'help'
     * @private
     */
    _makeMenuElement(menuName, useIconTypes = ['normal', 'active', 'hover'], menuType = 'normal') {
        const btnElement = document.createElement('li');
        const menuItemHtml = this.theme.makeMenSvgIconSet(useIconTypes, menuName);

        this._addTooltipAttribute(btnElement, menuName);
        btnElement.className = `tie-btn-${menuName} ${cls('item')} ${menuType}`;
        btnElement.innerHTML = menuItemHtml;

        this._menuElement.appendChild(btnElement);
    }

    /**
     * Add help action event
     * @private
     */
    _addHelpActionEvent() {
        snippet.forEach(HELP_MENUS, helpName => {
            this.eventHandler[helpName] = () => this._actions.main[helpName]();
            this._buttonElements[helpName].addEventListener('click', this.eventHandler[helpName]);
        });
    }

    /**
     * Remove help action event
     * @private
     */
    _removeHelpActionEvent() {
        snippet.forEach(HELP_MENUS, helpName => {
            this._buttonElements[helpName].removeEventListener('click', this.eventHandler[helpName]);
        });
    }

    /**
     * Add attribute for menu tooltip
     * @param {HTMLElement} element - menu element
     * @param {string} tooltipName - tooltipName
     * @private
     */
    _addTooltipAttribute(element, tooltipName) {
        element.setAttribute(
            'tooltip-content',
            this._locale.localize(tooltipName.replace(/^[a-z]/g, $0 => $0.toUpperCase()))
        );
    }

    /**
     * Add apply event
     * @private
     */
    _addApplyEvent() {
        this.eventHandler.apply = () => this._actions.main.apply();
        snippet.forEach(this._buttonElements.apply, element => {
            element.addEventListener('click', this.eventHandler.apply);
        });
    }

    _removeApplyEvent() {
        snippet.forEach(this._buttonElements.apply, element => {
            element.removeEventListener('click', this.eventHandler.apply);
        });
    }

    /**
     * Add download event
     * @private
     */
    _addDownloadEvent() {
        this.eventHandler.download = () => this._actions.main.download();
        snippet.forEach(this._buttonElements.download, element => {
            element.addEventListener('click', this.eventHandler.download);
        });
    }

    _removeDownloadEvent() {
        snippet.forEach(this._buttonElements.download, element => {
            element.removeEventListener('click', this.eventHandler.download);
        });
    }

    /**
     * Add cancel event
     * @private
     */
    _removeCancelEvent() {
        snippet.forEach(this._buttonElements.cancel, element => {
            element.removeEventListener('click', this.eventHandler.cancel);
        });
    }

    _addCancelEvent() {
        this.eventHandler.cancel = () => this._actions.main.cancel();
        snippet.forEach(this._buttonElements.cancel, element => {
            element.addEventListener('click', this.eventHandler.cancel);
        });
    }

    /**
     * Add load event
     * @private
     */
    _addLoadEvent() {
        this.eventHandler.loadImage = event => this._actions.main.load(event.target.files[0]);

        snippet.forEach(this._buttonElements.load, element => {
            element.addEventListener('change', this.eventHandler.loadImage);
        });
    }

    /**
     * Remmove load event
     * @private
     */
    _removeLoadEvent() {
        snippet.forEach(this._buttonElements.load, element => {
            element.removeEventListener('change', this.eventHandler.loadImage);
        });
    }

    /**
     * Add menu event
     * @param {string} menuName - menu name
     * @private
     */
    _addMainMenuEvent(menuName) {
        this.eventHandler[menuName] = () => this.changeMenu(menuName);
        this._buttonElements[menuName].addEventListener('click', this.eventHandler[menuName]);
    }

    /**
     * Add menu event
     * @param {string} menuName - menu name
     * @private
     */
    _addSubMenuEvent(menuName) {
        this[menuName].addEvent(this._actions[menuName]);
    }

    /**
     * Add menu event
     * @private
     */
    _addMenuEvent() {
        snippet.forEach(this.options.menu, menuName => {
            this._addMainMenuEvent(menuName);
            this._addSubMenuEvent(menuName);
        });
    }

    /**
     * Remove menu event
     * @private
     */
    _removeMainMenuEvent() {
        snippet.forEach(this.options.menu, menuName => {
            this._buttonElements[menuName].removeEventListener('click', this.eventHandler[menuName]);
        });
    }

    /**
     * Get editor area element
     * @returns {HTMLElement} editor area html element
     * @ignore
     */
    getEditorArea() {
        return this._editorElement;
    }

    /**
     * Add event for menu items
     * @ignore
     */
    activeMenuEvent() {
        if (this._initMenuEvent) {
            return;
        }

        this._addHelpActionEvent();
        this._addDownloadEvent();
        this._addApplyEvent();
        this._addCancelEvent();
        this._addMenuEvent();
        this._initMenu();
        this._initMenuEvent = true;
    }

    /**
     * Remove ui event
     * @private
     */
    _removeUiEvent() {
        this._removeHelpActionEvent();
        this._removeApplyEvent();
        this._removeDownloadEvent();
        this._removeCancelEvent();
        this._removeLoadEvent();
        this._removeMainMenuEvent();
    }

    /**
     * Destroy all menu instance
     * @private
     */
    _destroyAllMenu() {
        snippet.forEach(this.options.menu, menuName => {
            this[menuName].destroy();
        });
        this._els.zoomRange.destroy();
    }

    /**
     * Init canvas
     * @ignore
     */
    initCanvas() {
        const loadImageInfo = this._getLoadImage();
        if (loadImageInfo.path) {
            this._actions.main.initLoadImage(loadImageInfo.path, loadImageInfo.name).then(() => {
                this.activeMenuEvent();
                this.setSizeValue();
            });
        }

        this._addLoadEvent();

        const gridVisual = document.createElement('div');

        gridVisual.className = cls('grid-visual');
        const grid = `<table>
           <tr><td class="dot left-top"></td><td></td><td class="dot right-top"></td></tr>
           <tr><td></td><td></td><td></td></tr>
           <tr><td class="dot left-bottom"></td><td></td><td class="dot right-bottom"></td></tr>
         </table>`;
        gridVisual.innerHTML = grid;
        this._editorContainerElement = this._editorElement.querySelector(
            '.tui-image-editor-canvas-container'
        );
        this._editorContainerElement.appendChild(gridVisual);
    }

    setSizeValue() {
        const { width, height } = this._getCanvasMaxDimension();
        const imageSize = this.getCanvasImageSize();

        const widthSize = parseInt((width / imageSize.width) * 100, 10);
        const heightSize = parseInt((height / imageSize.height) * 100, 10);
        const sizeValue = widthSize > heightSize ? heightSize : widthSize;
        this._els.zoomRange.value = sizeValue;
        this.options.sizeValue = sizeValue;
    }
    /**
     * get editor area element
     * @returns {Object} load image option
     * @private
     */
    _getLoadImage() {
        return this.options.loadImage;
    }

    /**
     * change menu
     * @param {string} menuName - menu name
     * @param {boolean} toggle - whether toogle or not
     * @param {boolean} discardSelection - discard selection
     * @ignore
     */
    changeMenu(menuName, toggle = true, discardSelection = true) {
        setTimeout(() => {
            this._changeZoomRangeHandler(this._els.zoomRange.value);
            this.showZoom();

            if (!this._submenuChangeTransection) {
                this._submenuChangeTransection = true;
                this._changeMenu(menuName, toggle, discardSelection);
                this._submenuChangeTransection = false;
            }
        }, 0);
    }

    /**
     * change menu
     * @param {string} menuName - menu name
     * @param {boolean} toggle - whether toogle or not
     * @param {boolean} discardSelection - discard selection
     * @private
     */
    _changeMenu(menuName, toggle, discardSelection) {
        if (this.submenu) {
            this._buttonElements[this.submenu].classList.remove('active');
            this._mainElement.classList.remove(`tui-image-editor-menu-${this.submenu}`);
            if (discardSelection) {
                this._actions.main.discardSelection();
            }
            this._actions.main.changeSelectableAll(true);
            this[this.submenu].changeStandbyMode();
        }

        if (this.submenu === menuName && toggle) {
            this.submenu = null;
        } else {
            this._buttonElements[menuName].classList.add('active');
            this._mainElement.classList.add(`tui-image-editor-menu-${menuName}`);
            this.submenu = menuName;
            this[this.submenu].changeStartMode();
        }

        this.resizeEditor();
    }

    /**
     * Init menu
     * @private
     */
    _initMenu() {
        if (this.options.initMenu) {
            const evt = document.createEvent('MouseEvents');
            evt.initEvent('click', true, false);
            this._buttonElements[this.options.initMenu].dispatchEvent(evt);
        }

        if (this.icon) {
            this.icon.registDefaultIcon();
        }
    }

    /**
     * Get canvas max Dimension
     * @returns {Object} - width & height of editor
     * @private
     */
    _getCanvasMaxDimension() {
        const { maxWidth, maxHeight } = this._editorContainerElement.style;
        const width = parseFloat(maxWidth);
        const height = parseFloat(maxHeight);

        return {
            width,
            height,
        };
    }

    /**
     * Set editor position
     * @param {string} menuBarPosition - top or right or bottom or left
     * @private
     */
    _setEditorPosition(menuBarPosition) {
        // eslint-disable-line complexity
        const { width, height } = this._getCanvasMaxDimension();
        const editorElementStyle = this._editorElement.style;
        let top = 0;
        let left = 0;

        if (this.submenu) {
            if (menuBarPosition === 'bottom') {
                if (height > this._editorElementWrap.scrollHeight - 150) {
                    top = (height - this._editorElementWrap.scrollHeight) / 2;
                } else {
                    top = (150 / 2) * -1;
                }
            } else if (menuBarPosition === 'top') {
                if (height > this._editorElementWrap.offsetHeight - 150) {
                    top = 150 / 2 - (height - (this._editorElementWrap.offsetHeight - 150)) / 2;
                } else {
                    top = 150 / 2;
                }
            } else if (menuBarPosition === 'left') {
                if (width > this._editorElementWrap.offsetWidth - 248) {
                    left = 248 / 2 - (width - (this._editorElementWrap.offsetWidth - 248)) / 2;
                } else {
                    left = 248 / 2;
                }
            } else if (menuBarPosition === 'right') {
                if (width > this._editorElementWrap.scrollWidth - 248) {
                    left = (width - this._editorElementWrap.scrollWidth) / 2;
                } else {
                    left = (248 / 2) * -1;
                }
            }
        }
        editorElementStyle.top = `${top}px`;
        editorElementStyle.left = `${left}px`;
    }

    /**
     * Change zoom range
     * @param {number} value - zoom range value
     * @param {boolean} isLast - Is last change
     * @private
     */
    _changeZoomRangeHandler(value /*, isLast*/) {
        this._els.zoomRange.value = parseInt(value, 10);
        const imageSize = this.getCanvasImageSize();

        const width = imageSize.width * (value / 100);
        const height = imageSize.height * (value / 100);

        this.resizeEditorElement(width, height);
    }

    getZoomSize() {
        return this._els.zoomRange.value;
    }

    showZoom() {
        this._selectedElement.querySelector('.tui-image-editor-zoom-wrap').classList.add('active');
    }

    hideZoom() {
        this._selectedElement.querySelector('.tui-image-editor-zoom-wrap').classList.remove('active');
    }

    getResizeImageSize(value, type) {
        value = parseInt(value);
        const canvasImageSize = this.getCanvasImageSize();

        const imageSize = {};
        if (type == 'width') {
            imageSize.width = value;
            imageSize.height = parseInt((value / canvasImageSize.width) * canvasImageSize.height);
        } else if (type == 'height') {
            imageSize.width = parseInt((value / canvasImageSize.height) * canvasImageSize.width);
            imageSize.height = value;
        } else {
            imageSize.width = parseInt(canvasImageSize.width * (value / 100));
            imageSize.height = parseInt(canvasImageSize.height * (value / 100));
        }
        return imageSize;
    }

    getCropSize() {
        return this.options.resize;
    }

    getCanvasImageSize() {
        const imageWidth = parseInt(
            this._selectedElement.querySelector('.lower-canvas').attributes['width'].value
        );

        const imageHeight = parseInt(
            this._selectedElement.querySelector('.lower-canvas').attributes['height'].value
        );

        return { width: imageWidth, height: imageHeight };
    }

    getDrwwCropRectSize(value, type, presetType) {
        value = parseInt(value);
        const canvasImageSize = this.getCanvasImageSize();

        const imageSize = {};
        if (presetType > 0 && presetType < 1) {
            if (type == 'width') {
                if (parseInt(value * presetType) > canvasImageSize.width) {
                    imageSize.width = parseInt(canvasImageSize.height * presetType);
                    imageSize.height = canvasImageSize.height;
                } else {
                    imageSize.width = value;
                    imageSize.height = parseInt(value / presetType);
                }
            } else if (type == 'height') {
                if (value > canvasImageSize.height) {
                    value = canvasImageSize.height;
                }
                imageSize.width = parseInt(value * presetType);
                imageSize.height = value;
            }
        } else if (presetType > 1) {
            if (type == 'width') {
                if (value > canvasImageSize.width) {
                    value = canvasImageSize.width;
                }
                imageSize.width = value;
                imageSize.height = parseInt(value / presetType);
            } else if (type == 'height') {
                if (parseInt(value * presetType) > canvasImageSize.width) {
                    imageSize.width = canvasImageSize.width;
                    imageSize.height = parseInt(canvasImageSize.width / presetType);
                } else {
                    imageSize.width = parseInt(value * presetType);
                    imageSize.height = value;
                }
            }
        } else if (presetType == 1) {
            value =
                value > canvasImageSize.width || value > canvasImageSize.height
                    ? canvasImageSize.width < canvasImageSize.height
                        ? canvasImageSize.width
                        : canvasImageSize.height
                    : value;
            imageSize.width = value;
            imageSize.height = value;
        }
        return imageSize;
    }

    getWatermarkList() {
        return this.options.watermark;
    }

    onFabricScaling() {
        // eslint-disable-next-line no-console
        this[this.submenu].onFabricScaling();
    }
}

export default Ui;
