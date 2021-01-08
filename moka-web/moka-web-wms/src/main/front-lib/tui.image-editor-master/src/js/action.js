import { extend } from 'tui-code-snippet';
import { isSupportFileApi, base64ToBlob, toInteger } from './util';
import Imagetracer from './helper/imagetracer';

export default {
    /**
     * Get ui actions
     * @returns {Object} actions for ui
     * @private
     */
    getActions() {
        return {
            main: this._mainAction(),
            shape: this._shapeAction(),
            mosaic: this._mosaicAction(),
            crop: this._cropAction(),
            flip: this._flipAction(),
            resize: this._resizeAction(),
            rotate: this._rotateAction(),
            text: this._textAction(),
            mask: this._maskAction(),
            watermark: this._watermarkAction(),
            draw: this._drawAction(),
            icon: this._iconAction(),
            filter: this._filterAction(),
        };
    },

    /**
     * Main Action
     * @returns {Object} actions for ui main
     * @private
     */
    _mainAction() {
        const exitCropOnAction = () => {
            if (this.ui.submenu === 'crop') {
                this.stopDrawingMode();
                this.ui.changeMenu('crop');
            }
        };
        const setAngleRangeBarOnAction = angle => {
            if (this.ui.submenu === 'rotate') {
                this.ui.rotate.setRangeBarAngle('setAngle', angle);
            }
        };
        const setFilterStateRangeBarOnAction = filterOptions => {
            if (this.ui.submenu === 'filter') {
                this.ui.filter.setFilterState(filterOptions);
            }
        };
        const onEndUndoRedo = result => {
            setAngleRangeBarOnAction(result);
            setFilterStateRangeBarOnAction(result);

            return result;
        };

        return extend(
            {
                initLoadImage: (imagePath, imageName) =>
                    this.loadImageFromURL(imagePath, imageName).then(sizeValue => {
                        exitCropOnAction();
                        this.ui.initializeImgUrl = imagePath;
                        this.ui.resizeEditor({ imageSize: sizeValue });
                        this.clearUndoStack();
                    }),
                undo: () => {
                    if (!this.isEmptyUndoStack()) {
                        exitCropOnAction();
                        this.deactivateAll();
                        this.undo().then(onEndUndoRedo);
                        setTimeout(() => {
                            this.ui.setSizeValue();
                        }, 0);
                    }
                },
                redo: () => {
                    if (!this.isEmptyRedoStack()) {
                        exitCropOnAction();
                        this.deactivateAll();
                        this.redo().then(onEndUndoRedo);
                        setTimeout(() => {
                            this.ui.setSizeValue();
                        }, 0);
                    }
                },
                reset: () => {
                    exitCropOnAction();
                    this.loadImageFromURL(this.ui.initializeImgUrl, 'resetImage').then(sizeValue => {
                        exitCropOnAction();
                        this.ui.resizeEditor({ imageSize: sizeValue });
                        this.clearUndoStack();
                    });
                },
                delete: () => {
                    this.ui.changeHelpButtonEnabled('delete', false);
                    exitCropOnAction();
                    this.removeActiveObject();
                    this.activeObjectId = null;
                },
                deleteAll: () => {
                    exitCropOnAction();
                    this.clearObjects();
                    this.ui.changeHelpButtonEnabled('delete', false);
                    this.ui.changeHelpButtonEnabled('deleteAll', false);
                },
                load: file => {
                    if (!isSupportFileApi()) {
                        alert('This browser does not support file-api');
                    }

                    this.ui.initializeImgUrl = URL.createObjectURL(file);
                    this.loadImageFromFile(file)
                        .then(sizeValue => {
                            exitCropOnAction();
                            this.clearUndoStack();
                            this.ui.activeMenuEvent();
                            this.ui.resizeEditor({ imageSize: sizeValue });
                        })
                        ['catch'](message => Promise.reject(message));
                },
                cancel: () => {
                    if (this.callback.cancel) {
                        this.callback.cancel();
                    }
                },
                apply: () => {
                    window.console.log(this);
                    const dataURL = this.toDataURL();
                    let imageName = this.getImageName();
                    let blob, type, w;
                    if (this.callback.apply) {
                        blob = base64ToBlob(dataURL);
                        type = blob.type.split('/')[1];
                        this.callback.apply(URL.createObjectURL(blob, { type: type }), imageName);
                    } else if (isSupportFileApi() && window.saveAs) {
                        blob = base64ToBlob(dataURL);
                        type = blob.type.split('/')[1];
                        if (imageName.split('.').pop() !== type) {
                            imageName += `.${type}`;
                        }
                        saveAs(blob, imageName); // eslint-disable-line
                    } else {
                        w = window.open();
                        w.document.body.innerHTML = `<img src='${dataURL}'>`;
                    }
                },
                download: () => {
                    //                    window.console.log(this);
                    const dataURL = this.toDataURL();
                    let imageName = this.getImageName();
                    let blob, type, w;
                    if (isSupportFileApi() && window.saveAs) {
                        blob = base64ToBlob(dataURL);
                        type = blob.type.split('/')[1];
                        if (imageName.split('.').pop() !== type) {
                            imageName += `.${type}`;
                        }
                        saveAs(blob, imageName); // eslint-disable-line
                    } else {
                        w = window.open();
                        w.document.body.innerHTML = `<img src='${dataURL}'>`;
                    }
                },
            },
            this._commonAction()
        );
    },

    /**
     * Icon Action
     * @returns {Object} actions for ui icon
     * @private
     */
    _iconAction() {
        let cacheIconType;
        let cacheIconColor;
        let startX;
        let startY;
        let iconWidth;
        let iconHeight;
        let objId;

        this.on({
            iconCreateResize: ({ moveOriginPointer }) => {
                const scaleX = (moveOriginPointer.x - startX) / iconWidth;
                const scaleY = (moveOriginPointer.y - startY) / iconHeight;

                this.setObjectPropertiesQuietly(objId, {
                    scaleX: Math.abs(scaleX * 2),
                    scaleY: Math.abs(scaleY * 2),
                });
            },
            iconCreateEnd: () => {
                this.ui.icon.clearIconType();
                this.changeSelectableAll(true);
            },
        });

        const mouseDown = (e, originPointer) => {
            startX = originPointer.x;
            startY = originPointer.y;

            this.addIcon(cacheIconType, {
                left: originPointer.x,
                top: originPointer.y,
                fill: cacheIconColor,
            }).then(obj => {
                objId = obj.id;
                iconWidth = obj.width;
                iconHeight = obj.height;
            });
        };

        return extend(
            {
                changeColor: color => {
                    if (this.activeObjectId) {
                        this.changeIconColor(this.activeObjectId, color);
                    }
                },
                addIcon: (iconType, iconColor) => {
                    cacheIconType = iconType;
                    cacheIconColor = iconColor;
                    // this.readyAddIcon();
                    this.changeCursor('crosshair');
                    this.off('mousedown');
                    this.once('mousedown', mouseDown.bind(this));
                },
                cancelAddIcon: () => {
                    this.off('mousedown');
                    this.ui.icon.clearIconType();
                    this.changeSelectableAll(true);
                    this.changeCursor('default');
                },
                registDefalutIcons: (type, path) => {
                    const iconObj = {};
                    iconObj[type] = path;
                    this.registerIcons(iconObj);
                },
                registCustomIcon: (imgUrl, file) => {
                    const imagetracer = new Imagetracer();
                    imagetracer.imageToSVG(
                        imgUrl,
                        svgstr => {
                            const [, svgPath] = svgstr.match(/path[^>]*d="([^"]*)"/);
                            const iconObj = {};
                            iconObj[file.name] = svgPath;
                            this.registerIcons(iconObj);
                            this.addIcon(file.name, {
                                left: 100,
                                top: 100,
                            });
                        },
                        Imagetracer.tracerDefaultOption()
                    );
                },
            },
            this._commonAction()
        );
    },

    /**
     * Draw Action
     * @returns {Object} actions for ui draw
     * @private
     */
    _drawAction() {
        return extend(
            {
                setDrawMode: (type, settings) => {
                    this.stopDrawingMode();
                    if (type === 'free') {
                        this.startDrawingMode('FREE_DRAWING', settings);
                    } else {
                        this.startDrawingMode('LINE_DRAWING', settings);
                    }
                },
                setColor: color => {
                    this.setBrush({
                        color,
                    });
                },
            },
            this._commonAction()
        );
    },

    /**
     * Mask Action
     * @returns {Object} actions for ui mask
     * @private
     */
    _maskAction() {
        return extend(
            {
                loadImageFromURL: (imgUrl, file) =>
                    this.loadImageFromURL(this.toDataURL(), 'FilterImage').then(() => {
                        this.addImageObject(imgUrl).then(() => {
                            URL.revokeObjectURL(file);
                        });
                    }),
                applyFilter: () => {
                    this.applyFilter('mask', {
                        maskObjId: this.activeObjectId,
                    });
                },
            },
            this._commonAction()
        );
    },

    /**
     * Watermark Action
     * @returns {Object} actions for ui mask
     * @private
     */
    _watermarkAction() {
        return extend(
            {
                addImageObject: (imgUrl, file) =>
                    this.addImageObject(imgUrl, 'watermark').then(() => {
                        if (typeof file !== 'undefined') {
                            URL.revokeObjectURL(file);
                        }
                    }),
                getWatermarkList: () => {
                    return this.ui.getWatermarkList();
                },
                changeOpacityRangeHandler: opacity => {
                    if (this.activeObjectId) {
                        setTimeout(() => {
                            this.changeWatermarkOpacity(this.activeObjectId, opacity);
                        }, 0);
                    }
                },
            },
            this._commonAction()
        );
    },

    /**
     * Text Action
     * @returns {Object} actions for ui text
     * @private
     */
    _textAction() {
        return extend(
            {
                changeTextStyle: (styleObj, isSilent) => {
                    if (this.activeObjectId) {
                        this.changeTextStyle(this.activeObjectId, styleObj, isSilent);
                    }
                },
            },
            this._commonAction()
        );
    },

    /**
     * Resize Action
     * @returns {Object} actions for ui resize
     * @private
     */
    _resizeAction() {
        return extend(
            {
                changeImageSize: (width, height) => {
                    this.ui.resizeEditorElement(width, height);
                },
                getResizeImageSize: (value, type) => {
                    return this.ui.getResizeImageSize(value, type);
                },
                resizeCanvasImage: (width, height) => {
                    this.stopDrawingMode();
                    this.resizeCanvasImage(width, height);
                    this.ui.changeMenu('resize');
                },
                cancel: () => {
                    this.stopDrawingMode();
                    this.ui.changeMenu('resize');
                    this.ui._changeZoomRangeHandler(this.ui._els.zoomRange.value);
                },
            },
            this._commonAction()
        );
    },

    /**
     * Rotate Action
     * @returns {Object} actions for ui rotate
     * @private
     */
    _rotateAction() {
        return extend(
            {
                rotate: (angle, isSilent) => {
                    this.rotate(angle, isSilent);
                    this.ui.resizeEditor();
                    this.ui.rotate.setRangeBarAngle('rotate', angle);
                },
                setAngle: (angle, isSilent) => {
                    this.setAngle(angle, isSilent);
                    this.ui.resizeEditor();
                    this.ui.rotate.setRangeBarAngle('setAngle', angle);
                },
            },
            this._commonAction()
        );
    },

    /**
     * Shape Action
     * @returns {Object} actions for ui shape
     * @private
     */
    _shapeAction() {
        return extend(
            {
                changeShape: (changeShapeObject, isSilent) => {
                    if (this.activeObjectId) {
                        this.changeShape(this.activeObjectId, changeShapeObject, isSilent);
                    }
                },
                setDrawingShape: shapeType => {
                    this.setDrawingShape(shapeType);
                },
            },
            this._commonAction()
        );
    },

    /**
     * Mosaic Action
     * @returns {Object} actions for ui mosaic
     * @private
     */
    _mosaicAction() {
        return extend(
            {
                changeMosaic: (changeMosaicObject, isSilent) => {
                    if (this.activeObjectId) {
                        this.changeMosaic(this.activeObjectId, changeMosaicObject, isSilent);
                    }
                },
                setDrawingMosaic: mosaicType => {
                    this.setDrawingMosaic(mosaicType);
                },
            },
            this._commonAction()
        );
    },

    /**
     * Crop Action
     * @returns {Object} actions for ui crop
     * @private
     */
    _cropAction() {
        return extend(
            {
                crop: () => {
                    const cropRect = this.getCropzoneRect();
                    if (cropRect) {
                        this.crop(cropRect)
                            .then(() => {
                                this.stopDrawingMode();
                                this.ui.resizeEditor();
                                this.ui.changeMenu('crop');
                            })
                            ['catch'](message => Promise.reject(message));
                    }
                },
                cancel: () => {
                    this.stopDrawingMode();
                    this.ui.changeMenu('crop');
                },
                getCropzoneRect: () => {
                    return this.getCropzoneRect();
                },
                /* eslint-disable */
                preset: (presetType, width, height) => {
                    if (typeof presetType !== 'undefined' && presetType !== 0) {
                        this.setCropzoneRect(presetType);
                    } else if (typeof width !== 'undefined' && typeof height !== 'undefined') {
                        this.setCustomCropzoneRect(width, height);
                    } else {
                        this.setCropzoneRect();
                        this.ui.crop.changeApplyButtonStatus(false);
                    }
                },
                getCanvasImageSize: () => {
                    return this.ui.getCanvasImageSize();
                },
                getDrwwCropRectSize: (value, type, presetType) => {
                    return this.ui.getDrwwCropRectSize(value, type, presetType);
                },
                setCustomCropzoneRect: (width, height) => {
                    this.setCustomCropzoneRect(width, height);
                },
            },
            this._commonAction()
        );
    },

    /**
     * Flip Action
     * @returns {Object} actions for ui flip
     * @private
     */
    _flipAction() {
        return extend(
            {
                flip: flipType => this[flipType](),
            },
            this._commonAction()
        );
    },

    /**
     * Filter Action
     * @returns {Object} actions for ui filter
     * @private
     */
    _filterAction() {
        return extend(
            {
                applyFilter: (applying, type, options, isSilent) => {
                    if (applying) {
                        this.applyFilter(type, options, isSilent);
                    } else if (this.hasFilter(type)) {
                        this.removeFilter(type);
                    }
                },
            },
            this._commonAction()
        );
    },

    /**
     * Image Editor Event Observer
     */
    setReAction() {
        this.on({
            undoStackChanged: length => {
                if (length) {
                    this.ui.changeHelpButtonEnabled('undo', true);
                    this.ui.changeHelpButtonEnabled('reset', true);
                } else {
                    this.ui.changeHelpButtonEnabled('undo', false);
                    this.ui.changeHelpButtonEnabled('reset', false);
                }
                this.ui.resizeEditor();
            },
            redoStackChanged: length => {
                if (length) {
                    this.ui.changeHelpButtonEnabled('redo', true);
                } else {
                    this.ui.changeHelpButtonEnabled('redo', false);
                }
                this.ui.resizeEditor();
            },
            /* eslint-disable complexity */
            objectActivated: obj => {
                this.activeObjectId = obj.id;

                this.ui.changeHelpButtonEnabled('delete', true);
                this.ui.changeHelpButtonEnabled('deleteAll', true);

                if (obj.type === 'cropzone') {
                    this.ui.crop.changeApplyButtonStatus(true);
                } else if (['rect', 'circle', 'triangle'].indexOf(obj.type) > -1) {
                    this.stopDrawingMode();
                    if (obj.item == 'shape') {
                        this.ui.changeMenu('shape', false, false);
                        this.ui.shape.setShapeStatus({
                            strokeColor: obj.stroke,
                            strokeWidth: obj.strokeWidth,
                            fillColor: obj.fill,
                        });
                        this.ui.shape.setMaxStrokeValue(Math.min(obj.width, obj.height));
                    } else {
                        this.ui.changeMenu('mosaic', false, false);
                        this.ui.mosaic.setMosaicStatus({
                            mosaicValue: obj.mosaicValue,
                        });
                        this.ui.mosaic.setMaxMosaicValue();
                    }
                } else if (obj.type === 'path' || obj.type === 'line') {
                    if (this.ui.submenu !== 'draw') {
                        this.ui.changeMenu('draw', false, false);
                        this.ui.draw.changeStandbyMode();
                    }
                } else if (['i-text', 'text'].indexOf(obj.type) > -1) {
                    if (this.ui.submenu !== 'text') {
                        this.ui.changeMenu('text', false, false);
                    }

                    this.ui.text.setTextStyleStateOnAction(obj);
                } else if (obj.type === 'icon') {
                    this.stopDrawingMode();
                    if (this.ui.submenu !== 'icon') {
                        this.ui.changeMenu('icon', false, false);
                    }
                    this.ui.icon.setIconPickerColor(obj.fill);
                } else if (obj.type === 'watermark') {
                    this.stopDrawingMode();
                    this.ui.watermark._changeOpacityRangeHandler(obj.opacity * 10);
                    if (this.ui.submenu !== 'watermark') {
                        this.ui.changeMenu('watermark', false, false);
                    }
                }
            },
            /* eslint-enable complexity */
            addText: pos => {
                const { textColor: fill, fontSize, fontStyle, fontWeight, underline } = this.ui.text;
                const fontFamily = 'Noto Sans';

                this.addText('Double Click', {
                    position: pos.originPosition,
                    styles: { fill, fontSize, fontFamily, fontStyle, fontWeight, underline },
                }).then(() => {
                    this.changeCursor('default');
                });
            },
            addObjectAfter: obj => {
                if (['rect', 'circle', 'triangle'].indexOf(obj.type) > -1) {
                    if (this.ui.submenu == 'shape') {
                        this.ui.shape.setMaxStrokeValue(Math.min(obj.width, obj.height));
                        this.ui.shape.changeStandbyMode();
                    } else if (this.ui.submenu == 'mosaic') {
                        this.ui.mosaic.setMaxMosaicValue();
                        this.ui.mosaic.changeStandbyMode();
                    }
                }
            },
            objectScaled: obj => {
                if (['i-text', 'text'].indexOf(obj.type) > -1) {
                    this.ui.text.fontSize = toInteger(obj.fontSize);
                } else if (['rect', 'circle', 'triangle'].indexOf(obj.type) >= 0) {
                    const { width, height } = obj;
                    if (this.ui.submenu == 'shape') {
                        const strokeValue = this.ui.shape.getStrokeValue();
                        if (width < strokeValue) {
                            this.ui.shape.setStrokeValue(width);
                        }
                        if (height < strokeValue) {
                            this.ui.shape.setStrokeValue(height);
                        }
                    } else if (this.ui.submenu == 'mosaic') {
                        const mosaicValue = this.ui.mosaic.getMosaicValue();
                        this.ui.mosaic.setMosaicValue(mosaicValue);
                    }
                }
            },
            selectionCleared: () => {
                this.activeObjectId = null;
                if (this.ui.submenu === 'text') {
                    this.changeCursor('text');
                } else if (this.ui.submenu !== 'draw' && this.ui.submenu !== 'crop') {
                    this.stopDrawingMode();
                }
            },
        });
    },

    /**
     * Common Action
     * @returns {Object} common actions for ui
     * @private
     */
    _commonAction() {
        return {
            modeChange: menu => {
                switch (menu) {
                    case 'text':
                        this._changeActivateMode('TEXT');
                        break;
                    case 'crop':
                        this.startDrawingMode('CROPPER');
                        break;
                    case 'shape':
                        this._changeActivateMode('SHAPE');
                        this.setDrawingShape(this.ui.shape.type, this.ui.shape.options);
                        break;
                    case 'mosaic':
                        this._changeActivateMode('MOSAIC');
                        this.setDrawingMosaic(this.ui.mosaic.type, this.ui.mosaic.options);
                        break;
                    case 'resize':
                        this.ui.hideZoom();
                        break;
                    default:
                        break;
                }
            },
            deactivateAll: this.deactivateAll.bind(this),
            changeSelectableAll: this.changeSelectableAll.bind(this),
            discardSelection: this.discardSelection.bind(this),
            stopDrawingMode: this.stopDrawingMode.bind(this),
        };
    },

    /**
     * Mixin
     * @param {ImageEditor} ImageEditor instance
     */
    mixin(ImageEditor) {
        extend(ImageEditor.prototype, this);
    },
};
