/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Mosaic component
 */
import fabric from 'fabric';
import Component from '../interface/component';
import {
    rejectMessages,
    eventNames,
    keyCodes as KEY_CODES,
    componentNames,
    fObjectOptions,
    MOSAIC_DEFAULT_OPTIONS,
} from '../consts';
import resizeHelper from '../helper/mosaicResizeHelper';
import { Promise } from '../util';
import { extend, inArray } from 'tui-code-snippet';

const MOSAIC_INIT_OPTIONS = extend(
    {
        mosaicValue: 10,
        item: 'mosaic',
        stroke: '#fff',
        strokeWidth: 2,
        fill: 'transparent',
    },
    MOSAIC_DEFAULT_OPTIONS
);

const DEFAULT_TYPE = 'rect';
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 20;

const mosaicType = ['rect', 'circle'];

/**
 * Mosaic
 * @class Mosaic
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
export default class Mosaic extends Component {
    constructor(graphics) {
        super(componentNames.MOSAIC, graphics);

        /**
         * Object of The drawing mosaic
         * @type {fabric.Object}
         * @private
         */
        this._mosaicObj = null;

        /**
         * Type of the drawing mosaic
         * @type {string}
         * @private
         */
        this._type = DEFAULT_TYPE;

        /**
         * Options to draw the mosaic
         * @type {Object}
         * @private
         */
        this._options = extend({}, MOSAIC_INIT_OPTIONS);

        /**
         * Whether the mosaic object is selected or not
         * @type {boolean}
         * @private
         */
        this._isSelected = false;

        /**
         * Pointer for drawing mosaic (x, y)
         * @type {Object}
         * @private
         */
        this._startPoint = {};

        /**
         * Pointer for drawing mosaic (x, y)
         * @type {Object}
         * @private
         */
        this._endPoint = {};

        this._modify = false;

        /**
         * Using shortcut on drawing mosaic
         * @type {boolean}
         * @private
         */
        this._withShiftKey = false;

        /**
         * Event handler list
         * @type {Object}
         * @private
         */
        this._handlers = {
            mousedown: this._onFabricMouseDown.bind(this),
            mousemove: this._onFabricMouseMove.bind(this),
            mouseup: this._onFabricMouseUp.bind(this),
            keydown: this._onKeyDown.bind(this),
            keyup: this._onKeyUp.bind(this),
        };
    }

    /**
     * Start to draw the mosaic on canvas
     * @ignore
     */
    start() {
        const canvas = this.getCanvas();

        this._isSelected = false;

        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        canvas.uniScaleTransform = true;
        canvas.on({
            'mouse:down': this._handlers.mousedown,
        });

        fabric.util.addListener(document, 'keydown', this._handlers.keydown);
        fabric.util.addListener(document, 'keyup', this._handlers.keyup);
    }

    /**
     * End to draw the mosaic on canvas
     * @ignore
     */
    end() {
        const canvas = this.getCanvas();

        this._isSelected = false;

        canvas.defaultCursor = 'default';

        canvas.selection = true;
        canvas.uniScaleTransform = false;
        canvas.off({
            'mouse:down': this._handlers.mousedown,
        });

        fabric.util.removeListener(document, 'keydown', this._handlers.keydown);
        fabric.util.removeListener(document, 'keyup', this._handlers.keyup);
    }

    /**
     * Set states of the current drawing mosaic
     * @ignore
     * @param {string} type - mosaic type (ex: 'rect', 'circle')
     * @param {Object} [options] - mosaic options
     *      @param {string} [options.fill] - mosaic foreground color (ex: '#fff', 'transparent')
     *      @param {number} [mosaicValue] -  mosaic value
     *      @param {string} [options.stoke] - Mosaic outline color
     *      @param {number} [options.strokeWidth] - Mosaic outline width
     *      @param {number} [options.width] - Width value (When type option is 'rect', this options can use)
     *      @param {number} [options.height] - Height value (When type option is 'rect', this options can use)
     *      @param {number} [options.rx] - Radius x value (When type option is 'circle', this options can use)
     *      @param {number} [options.ry] - Radius y value (When type option is 'circle', this options can use)
     */
    setStates(type, options) {
        this._type = type;

        if (options) {
            this._options = extend(this._options, options);
        }
    }

    /**
     * Add the mosaic
     * @ignore
     * @param {string} type - mosaic type (ex: 'rect', 'circle')
     * @param {Object} options - mosaic options
     *      @param {string} [options.fill] - mosaic foreground color (ex: '#fff', 'transparent')
     *      @param {number} [options.mosaicValue] -  mosaic value
     *      @param {string} [options.stoke] - Mosaic outline color
     *      @param {number} [options.strokeWidth] - Mosaic outline width
     *      @param {number} [options.width] - Width value (When type option is 'rect', this options can use)
     *      @param {number} [options.height] - Height value (When type option is 'rect', this options can use)
     *      @param {number} [options.rx] - Radius x value (When type option is 'circle', this options can use)
     *      @param {number} [options.ry] - Radius y value (When type option is 'circle', this options can use)
     *      @param {number} [options.isRegular] - Whether scaling mosaic has 1:1 ratio or not
     * @returns {Promise}
     */
    add(type, options) {
        return new Promise(resolve => {
            const canvas = this.getCanvas();
            options = this._extendOptions(options);

            const mosaicObj = this._createInstance(type, options);

            this._bindEventOnMosaic(mosaicObj);

            canvas.add(mosaicObj).setActiveObject(mosaicObj);

            const objectProperties = this.graphics.createObjectProperties(mosaicObj);

            resolve(objectProperties);
        });
    }

    /**
     * Change the mosaic
     * @ignore
     * @param {fabric.Object} mosaicObj - Selected mosaic object on canvas
     * @param {Object} options - mosaic options
     *      @param {string} [options.fill] - mosaic foreground color (ex: '#fff', 'transparent')
     *      @param {string} [options.stroke] - mosaic outline color
     *      @param {number} [options.strokeWidth] - mosaic outline width
     *      @param {string} [options.mosaicValue] - mosaic value
     *      @param {number} [options.width] - Width value (When type option is 'rect', this options can use)
     *      @param {number} [options.height] - Height value (When type option is 'rect', this options can use)
     *      @param {number} [options.rx] - Radius x value (When type option is 'circle', this options can use)
     *      @param {number} [options.ry] - Radius y value (When type option is 'circle', this options can use)
     *      @param {number} [options.isRegular] - Whether scaling mosaic has 1:1 ratio or not
     * @returns {Promise}
     */
    change(mosaicObj, options) {
        return new Promise((resolve, reject) => {
            if (inArray(mosaicObj.get('type'), mosaicType) < 0) {
                reject(rejectMessages.unsupportedType);
            }
            if (!this._modify) {
                mosaicObj.fill = 'transparent';
                this.getCanvas().renderAll();

                mosaicObj.set(options);
                this.makeMosaic(mosaicObj);
                this.getCanvas().renderAll();
            }
            resolve();
        });
    }

    /**
     * Create the instance of mosaic
     * @param {string} type - mosaic type
     * @param {Object} options - Options to creat the mosaic
     * @returns {fabric.Object} mosaic instance
     * @private
     */
    _createInstance(type, options) {
        let instance;

        switch (type) {
            case 'rect':
                instance = new fabric.Rect(options);
                break;
            case 'circle':
                instance = new fabric.Ellipse(
                    extend(
                        {
                            type: 'circle',
                        },
                        options
                    )
                );
                break;
            default:
                instance = {};
        }

        return instance;
    }

    /**
     * Get the options to create the mosaic
     * @param {Object} options - Options to creat the mosaic
     * @returns {Object} mosaic options
     * @private
     */
    _extendOptions(options) {
        const selectionStyles = fObjectOptions.SELECTION_STYLE;

        options = extend({}, MOSAIC_INIT_OPTIONS, this._options, selectionStyles, options);

        if (options.isRegular) {
            options.lockUniScaling = true;
        }

        return options;
    }

    /**
     * Bind fabric events on the creating mosaic object
     * @param {fabric.Object} mosaicObj - Mosaic object
     * @private
     */
    _bindEventOnMosaic(mosaicObj) {
        const self = this;
        const canvas = this.getCanvas();

        mosaicObj.on({
            added() {
                self._mosaicObj = this;
                resizeHelper.setOrigins(self._mosaicObj);
            },
            mousedown() {
                self._modify = true;
                if (
                    typeof self._mosaicObj !== 'undefined' &&
                    self._mosaicObj != null &&
                    self._mosaicObj.angle == 0
                ) {
                    const canvas = self.getCanvas();

                    self._mosaicObj.stroke = '#fff';
                    self._mosaicObj.strokeWidth = 2;
                    self._mosaicObj.fill = 'transparent';

                    const objectProperties = self.graphics.createObjectProperties(self._mosaicObj);
                    canvas.setActiveObject(self._mosaicObj);
                    self.fire(
                        eventNames.ADD_OBJECT_AFTER,
                        self.graphics.createObjectProperties(objectProperties)
                    );
                    canvas.renderAll();
                }
            },
            mouseup(fEvent) {
                self._modify = false;
                self._endPoint = canvas.getPointer(fEvent.e);
                if (
                    typeof self._mosaicObj !== 'undefined' &&
                    self._mosaicObj != null &&
                    self._mosaicObj.angle == 0
                ) {
                    if (self._startPoint.x > self._endPoint.x) {
                        self._mosaicObj.startPoint.x = self._endPoint.x;
                    }
                    if (self._startPoint.y > self._endPoint.y) {
                        self._mosaicObj.startPoint.y = self._endPoint.y;
                    }

                    resizeHelper.setOrigins(self._mosaicObj);
                    const mosaicObj = self._mosaicObj;

                    if (!mosaicObj) {
                        self.add(self._type, {
                            left: mosaicObj.startPoint.x,
                            top: mosaicObj.startPoint.y,
                            width: DEFAULT_WIDTH,
                            height: DEFAULT_HEIGHT,
                        }).then(objectProps => {
                            self.fire(eventNames.ADD_OBJECT, objectProps);
                        });
                    } else if (mosaicObj) {
                        resizeHelper.adjustOriginToCenter(mosaicObj);
                        self.makeMosaic(mosaicObj);
                    }
                }
            },
            selected() {
                self._isSelected = true;
                self._mosaicObj = this;
                canvas.uniScaleTransform = true;
                canvas.defaultCursor = 'default';
                resizeHelper.setOrigins(self._mosaicObj);
            },
            deselected() {
                self._isSelected = false;
                self._mosaicObj = null;
                canvas.defaultCursor = 'crosshair';
                canvas.uniScaleTransform = false;
            },
            modified() {
                const currentObj = self._mosaicObj;
                resizeHelper.adjustOriginToCenter(currentObj);
                resizeHelper.setOrigins(currentObj);
            },
            scaling(fEvent) {
                const pointer = canvas.getPointer(fEvent.e);
                const currentObj = self._mosaicObj;
                canvas.setCursor('crosshair');
                resizeHelper.resize(currentObj, pointer, true);
            },
        });
    }

    /**
     * MouseDown event handler on canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseDown(fEvent) {
        if (!fEvent.target) {
            this._isSelected = false;
            this._mosaicObj = false;
        }

        if (!this._isSelected && !this._mosaicObj) {
            const canvas = this.getCanvas();
            this._startPoint = canvas.getPointer(fEvent.e);

            canvas.on({
                'mouse:move': this._handlers.mousemove,
                'mouse:up': this._handlers.mouseup,
            });
        }
    }

    /**
     * MouseDown event handler on canvas
     * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event object
     * @private
     */
    _onFabricMouseMove(fEvent) {
        const canvas = this.getCanvas();
        const pointer = canvas.getPointer(fEvent.e);
        const startPointX = this._startPoint.x;
        const startPointY = this._startPoint.y;
        const width = startPointX - pointer.x;
        const height = startPointY - pointer.y;
        const mosaic = this._mosaicObj;
        if (!mosaic) {
            this.add(this._type, {
                left: startPointX,
                top: startPointY,
                width,
                height,
            }).then(objectProps => {
                this.fire(eventNames.ADD_OBJECT, objectProps);
            });
        } else {
            this._mosaicObj.set({
                isRegular: this._withShiftKey,
            });

            resizeHelper.resize(mosaic, pointer);
            canvas.renderAll();
        }
    }

    /**
     * MouseUp event handler on canvas
     * @private
     */
    _onFabricMouseUp() {
        const canvas = this.getCanvas();
        self._modify = false;

        const startPointX = this._startPoint.x;
        const startPointY = this._startPoint.y;
        const mosaic = this._mosaicObj;

        if (!mosaic) {
            this.add(self._type, {
                left: startPointX,
                top: startPointY,
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
            }).then(objectProps => {
                this.fire(eventNames.ADD_OBJECT, objectProps);
            });
        } else if (mosaic) {
            resizeHelper.adjustOriginToCenter(mosaic);
            this.makeMosaic(mosaic);
        }

        canvas.off({
            'mouse:move': this._handlers.mousemove,
            'mouse:up': this._handlers.mouseup,
        });
    }

    /**
     * Keydown event handler on document
     * @param {KeyboardEvent} e - Event object
     * @private
     */
    _onKeyDown(e) {
        if (e.keyCode === KEY_CODES.SHIFT) {
            this._withShiftKey = true;

            if (this._mosaicObj) {
                this._mosaicObj.isRegular = true;
            }
        }
    }

    /**
     * Keyup event handler on document
     * @param {KeyboardEvent} e - Event object
     * @private
     */
    _onKeyUp(e) {
        if (e.keyCode === KEY_CODES.SHIFT) {
            this._withShiftKey = false;

            if (this._mosaicObj) {
                this._mosaicObj.isRegular = false;
            }
        }
    }

    makeMosaic(mosaicObj) {
        const self = this;
        const canvas = this.getCanvas();
        (mosaicObj.stroke = ''), (mosaicObj.strokeWidth = 0);

        var filter = new fabric.Image.filters.Pixelate({
            blocksize: mosaicObj.mosaicValue,
        });

        mosaicObj.set({
            flipX: false,
            flipY: false,
        });

        const startPoint = mosaicObj.origins.lt;
        const cropImage = new fabric.Image();
        cropImage.src = canvas.toDataURL({
            left: startPoint.x + mosaicObj.mosaicValue / 2,
            top: startPoint.y + mosaicObj.mosaicValue / 2,
            width: mosaicObj.width,
            height: mosaicObj.height,
        });

        const callback = this.graphics._callbackAfterLoadingImageObject.bind(this);

        fabric.Image.fromURL(cropImage.src, image => {
            image.filters.push(filter);
            image.applyFilters();

            callback(image, mosaicObj.left, mosaicObj.top, function(object) {
                mosaicObj.setPatternFill({
                    source: object.canvas.toDataURL({
                        left: startPoint.x,
                        top: startPoint.y,
                        width: mosaicObj.width,
                        height: mosaicObj.height,
                    }),
                    repeat: 'no-repeat',
                });

                const objectProperties = self.graphics.createObjectProperties(mosaicObj);
                canvas.setActiveObject(mosaicObj);

                self.fire(
                    eventNames.ADD_OBJECT_AFTER,
                    self.graphics.createObjectProperties(objectProperties)
                );

                setTimeout(() => {
                    canvas.remove(object);
                }, 1);
            });
        });
    }
}
