/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhn.com>
 * @fileoverview Mosaic resize helper
 */
const DIVISOR = {
    rect: 1,
    circle: 2,
};
const DIMENSION_KEYS = {
    rect: {
        w: 'width',
        h: 'height',
    },
    circle: {
        w: 'rx',
        h: 'ry',
    },
};

/**
 * Set the start point value to the mosaic object
 * @param {fabric.Object} mosaic - Mosaic object
 * @ignore
 */
function setStartPoint(mosaic) {
    const { originX, originY } = mosaic;
    const originKey = originX.substring(0, 1) + originY.substring(0, 1);

    mosaic.startPoint = mosaic.origins[originKey];
}

/**
 * Get the positions of ratated origin by the pointer value
 * @param {{x: number, y: number}} origin - Origin value
 * @param {{x: number, y: number}} pointer - Pointer value
 * @param {number} angle - Rotating angle
 * @returns {Object} Postions of origin
 * @ignore
 */
function getPositionsOfRotatedOrigin(origin, pointer, angle) {
    const sx = origin.x;
    const sy = origin.y;
    const px = pointer.x;
    const py = pointer.y;
    const r = (angle * Math.PI) / 180;
    const rx = (px - sx) * Math.cos(r) - (py - sy) * Math.sin(r) + sx;
    const ry = (px - sx) * Math.sin(r) + (py - sy) * Math.cos(r) + sy;

    return {
        originX: sx > rx ? 'right' : 'left',
        originY: sy > ry ? 'bottom' : 'top',
    };
}

/**
 * Whether the mosaic has the center origin or not
 * @param {fabric.Object} mosaic - Mosaic object
 * @returns {boolean} State
 * @ignore
 */
function hasCenterOrigin(mosaic) {
    return mosaic.originX === 'center' && mosaic.originY === 'center';
}

/**
 * Adjust the origin of mosaic by the start point
 * @param {{x: number, y: number}} pointer - Pointer value
 * @param {fabric.Object} mosaic - Mosaic object
 * @ignore
 */
function adjustOriginByStartPoint(pointer, mosaic) {
    const centerPoint = mosaic.getPointByOrigin('center', 'center');
    const angle = -mosaic.angle;
    const originPositions = getPositionsOfRotatedOrigin(centerPoint, pointer, angle);
    const { originX, originY } = originPositions;
    const origin = mosaic.getPointByOrigin(originX, originY);
    const left = mosaic.left - (centerPoint.x - origin.x);
    const top = mosaic.top - (centerPoint.y - origin.y);

    mosaic.set({
        originX,
        originY,
        left,
        top,
    });

    mosaic.setCoords();
}

/**
 * Adjust the origin of mosaic by the moving pointer value
 * @param {{x: number, y: number}} pointer - Pointer value
 * @param {fabric.Object} mosaic - Mosaic object
 * @ignore
 */
function adjustOriginByMovingPointer(pointer, mosaic) {
    const origin = mosaic.startPoint;
    const angle = -mosaic.angle;
    const originPositions = getPositionsOfRotatedOrigin(origin, pointer, angle);
    const { originX, originY } = originPositions;

    mosaic.setPositionByOrigin(origin, originX, originY);
    mosaic.setCoords();
}

/**
 * Adjust the dimension of mosaic on firing scaling event
 * @param {fabric.Object} mosaic - Mosaic object
 * @ignore
 */
function adjustDimensionOnScaling(mosaic) {
    const { type, scaleX, scaleY } = mosaic;
    const dimensionKeys = DIMENSION_KEYS[type];
    let width = mosaic[dimensionKeys.w] * scaleX;
    let height = mosaic[dimensionKeys.h] * scaleY;

    if (mosaic.isRegular) {
        const maxScale = Math.max(scaleX, scaleY);

        width = mosaic[dimensionKeys.w] * maxScale;
        height = mosaic[dimensionKeys.h] * maxScale;
    }

    const options = {
        hasControls: false,
        hasBorders: false,
        scaleX: 1,
        scaleY: 1,
    };

    options[dimensionKeys.w] = width;
    options[dimensionKeys.h] = height;

    mosaic.set(options);
}

/**
 * Adjust the dimension of mosaic on firing mouse move event
 * @param {{x: number, y: number}} pointer - Pointer value
 * @param {fabric.Object} mosaic - Mosaic object
 * @ignore
 */
function adjustDimensionOnMouseMove(pointer, mosaic) {
    const { type, strokeWidth, startPoint: origin } = mosaic;
    const divisor = DIVISOR[type];
    const dimensionKeys = DIMENSION_KEYS[type];
    const options = {};
    let width = Math.abs(origin.x - pointer.x) / divisor;
    let height = Math.abs(origin.y - pointer.y) / divisor;

    if (width > strokeWidth) {
        width -= strokeWidth / divisor;
    }

    if (height > strokeWidth) {
        height -= strokeWidth / divisor;
    }

    if (mosaic.isRegular) {
        width = height = Math.max(width, height);
    }

    options[dimensionKeys.w] = width;
    options[dimensionKeys.h] = height;

    mosaic.set(options);
}

module.exports = {
    /**
     * Set each origin value to mosaic
     * @param {fabric.Object} mosaic - Mosaic object
     */
    setOrigins(mosaic) {
        const leftTopPoint = mosaic.getPointByOrigin('left', 'top');
        const rightTopPoint = mosaic.getPointByOrigin('right', 'top');
        const rightBottomPoint = mosaic.getPointByOrigin('right', 'bottom');
        const leftBottomPoint = mosaic.getPointByOrigin('left', 'bottom');

        mosaic.origins = {
            lt: leftTopPoint,
            rt: rightTopPoint,
            rb: rightBottomPoint,
            lb: leftBottomPoint,
        };
    },

    /**
     * Resize the mosaic
     * @param {fabric.Object} mosaic - Mosaic object
     * @param {{x: number, y: number}} pointer - Mouse pointer values on canvas
     * @param {boolean} isScaling - Whether the resizing action is scaling or not
     */
    resize(mosaic, pointer, isScaling) {
        if (hasCenterOrigin(mosaic)) {
            adjustOriginByStartPoint(pointer, mosaic);
            setStartPoint(mosaic);
        }

        if (isScaling) {
            adjustDimensionOnScaling(mosaic, pointer);
        } else {
            adjustDimensionOnMouseMove(pointer, mosaic);
        }

        adjustOriginByMovingPointer(pointer, mosaic);
    },

    /**
     * Adjust the origin position of mosaic to center
     * @param {fabric.Object} mosaic - Mosaic object
     */
    adjustOriginToCenter(mosaic) {
        const centerPoint = mosaic.getPointByOrigin('center', 'center');
        const { originX, originY } = mosaic;
        const origin = mosaic.getPointByOrigin(originX, originY);
        const left = mosaic.left + (centerPoint.x - origin.x);
        const top = mosaic.top + (centerPoint.y - origin.y);

        mosaic.set({
            hasControls: true,
            hasBorders: true,
            originX: 'center',
            originY: 'center',
            left,
            top,
        });

        mosaic.setCoords(); // For left, top properties
    },
};
