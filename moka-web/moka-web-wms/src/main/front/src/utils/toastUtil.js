import { toastr } from 'react-redux-toastr';
export { toastr } from 'react-redux-toastr';

const TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARN: 'warning',
    INFO: 'info',
    CONFIRM: 'confirm',
};

const defaultOptions = {
    progressBar: false,
};
/**
 * 성공 notification
 * @param {string} title 제목
 * @param {string} message 내용
 * @param {object} options 세부옵션
 */
const success = (title = '', message, options) => {
    toastr.success(title, message, options);
};

/**
 * 오류 notification
 * @param {string} title 제목
 * @param {string} message 내용
 * @param {object} options 세부옵션
 */
const error = (title = '', message, options) => {
    toastr.error(title, message, options);
};

/**
 * 경고 notification
 * @param {string} title 제목
 * @param {string} message 내용
 * @param {object} options 세부옵션
 */
const warning = (title = '', message, options) => {
    toastr.warning(title, message, options);
};

export const notification = (type, message, options = defaultOptions) => {
    switch (type) {
        case TYPES.SUCCESS:
            success(type, message, options);
            break;
        case TYPES.ERROR:
            error(type, message, options);
            break;
        case TYPES.WARN:
            console.log(type);
            warning(type, message, options);
            break;
        default:
            break;
    }
};
