import { toastr } from 'react-redux-toastr';

export { toastr } from 'react-redux-toastr';

const DEFAULT_TITLE = {
    SUCCESS: '성공',
    FAIL: '실패',
    ERROR: '오류',
    COMPLETE: '완료',
    WARNING: '경고',
    INFO: '안내',
    CONFIRM: '확인',
};

const TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARN: 'warning',
    INFO: 'info',
    CONFIRM: 'confirm',
};

const DEFAULT_SUCCESS_MSG = '정상 처리 되었습니다.';
const DEFAULT_ERROR_MSG = '처리 중 오류가 발생했습니다.';
const DEFAULT_NO_DATA = '수신된 데이터가 없습니다.';
const defaultOptions = {
    progressBar: false,
};
/**
 * 성공 notification
 * @param {string} title 제목
 * @param {string} message 내용
 * @param {object} options 세부옵션
 */
const success = (
    title = '',
    message,
    options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 3000,
    },
) => {
    toastr.success(title, message, options);
};

/**
 * 오류 notification
 * @param {string} title 제목
 * @param {string} message 내용
 * @param {object} options 세부옵션
 */
const error = (
    title = '',
    message,
    options = {
        closeButton: true,
        progressBar: false,
        showMethod: 'fadeIn',
        transitionIn: 'fadeIn',
        transitionOut: 'fadeOut',
        position: 'top-center',
        removeOnHover: false,
        attention: true,
        timeOut: 5000,
    },
) => {
    toastr.error(title, message, options);
};

/**
 * 경고 notification
 * @param {string} title 제목
 * @param {string} message 내용
 * @param {object} options 세부옵션
 */
const warning = (
    title = '',
    message,
    options = {
        closeButton: true,
        progressBar: false,
        showMethod: 'fadeIn',
        transitionIn: 'fadeIn',
        transitionOut: 'fadeOut',
        position: 'top-right',
        timeOut: 0,
    },
) => {
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

export default {
    success: (message) => {
        success(DEFAULT_TITLE.SUCCESS, message);
    },
    complete: (message) => {
        toastr.info(DEFAULT_TITLE.COMPLETE, message, {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            position: 'bottom-right',
            timeOut: 3000,
        });
    },
    info: (message) => {
        toastr.info(DEFAULT_TITLE.INFO, message, {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            position: 'bottom-right',
            timeOut: 3000,
        });
    },
    fail: (message) => {
        error(DEFAULT_TITLE.FAIL, message);
    },
    error: (message) => {
        error(DEFAULT_TITLE.ERROR, message);
    },
    warn: (message) => {
        warning(DEFAULT_TITLE.WARNING, message);
    },
    confirm: (message, ok, cancel) => {
        toastr.confirm(message, {
            closeButton: true,
            progressBar: false,
            showMethod: 'slideDown',
            position: 'top-center',
            timeOut: 5000,
            attention: true,
            okText: '예',
            cancelText: '아니오',
            onOk: (id) => {
                if (ok) {
                    ok(id);
                }
            },
            onCancel: () => {
                if (cancel) {
                    cancel();
                }
            },
        });
    },
    result: (response, onSuccess, onFail) => {
        if (response && response.header) {
            const resultHeader = response.header;

            if (resultHeader.success) {
                success(DEFAULT_TITLE.SUCCESS, resultHeader.message || DEFAULT_SUCCESS_MSG);
                if (onSuccess) {
                    onSuccess(response);
                }
            } else {
                error(DEFAULT_TITLE.FAIL, resultHeader.message || DEFAULT_ERROR_MSG);
                if (onFail) {
                    onFail(response);
                }
            }
        } else {
            error(DEFAULT_TITLE.ERROR, DEFAULT_NO_DATA);
            if (onFail) {
                onFail(response);
            }
        }
    },
};
