export const POSITION = {
    TOP: 'modal-dialog-toped',
    CENTER: 'modal-dialog-centered'
};

export const TYPE = {
    ALERT: 'alert',
    WAIT: 'wait',
    CONFIRM: 'confirm',
    DEFAULT: 'default'
};

export const ACTION = {
    SHOW: 0,
    CLOSE: 1,
    DID_MOUNT: 2,
    WILL_UNMOUNT: 3,
    ON_CHANGE: 4
};

export function isValidDelay(val) {
    return typeof val === 'number' && !Number.isNaN(val) && val > 0;
}

export function objectValues(obj) {
    return Object.keys(obj).map((key) => obj[key]);
}

export const canUseDom = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

function withRequired(fn) {
    fn.isRequired = function (props, propName, componentName) {
        const prop = props[propName];

        if (typeof prop === 'undefined') {
            return new Error(
                `The prop ${propName} is marked as required in ${componentName}, but its value is undefined.`
            );
        }

        return fn(props, propName, componentName);
    };
    return fn;
}

export const falseOrDelay = withRequired((props, propName, componentName) => {
    const prop = props[propName];

    if (prop !== false && !isValidDelay(prop)) {
        return new Error(
            `${componentName} expect ${propName}  to be a valid Number > 0 or equal to false. ${prop} given.`
        );
    }

    return null;
});
