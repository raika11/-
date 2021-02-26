import React from 'react';
import { toastr } from 'react-redux-toastr';
import { MokaMessageBox } from '@components';

const DEFAULT_TITLE = {
    SUCCESS: '성공',
    COMPLATE: '완료',
    FAIL: '실패',
    ERROR: '오류',
    COMPLETE: '완료',
    WARNING: '경고',
    INFO: '안내',
    CONFIRM: '확인',
    ALERT: '알림',
};

const DEFAULT_SUCCESS_MSG = '정상 처리 되었습니다.';
const DEFAULT_ERROR_MSG = '처리 중 오류가 발생했습니다.';
const DEFAULT_NO_DATA = '수신된 데이터가 없습니다.';

export const toast = {
    success: (message) => {
        toastr.success(DEFAULT_TITLE.COMPLETE, message, {
            closeButton: true,
            progressBar: false,
            showMethod: 'slideDown',
            position: 'top-right',
            timeOut: 2000,
            escapeHtml: false,
        });
    },
    complete: (message) => {
        toastr.success(DEFAULT_TITLE.COMPLETE, message, {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            position: 'top-right',
            timeOut: 2000,
            escapeHtml: false,
        });
    },
    info: (message) => {
        toastr.info(DEFAULT_TITLE.INFO, message, {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            position: 'top-right',
            timeOut: 3000,
            escapeHtml: false,
        });
    },
    fail: (message) => {
        toastr.error(DEFAULT_TITLE.FAIL, message, {
            closeButton: true,
            progressBar: false,
            showMethod: 'fadeIn',
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            position: 'top-center',
            removeOnHover: false,
            attention: true,
            timeOut: 0,
            escapeHtml: false,
        });
    },
    error: (message) => {
        toastr.error(DEFAULT_TITLE.FAIL, message, {
            closeButton: true,
            progressBar: true,
            showMethod: 'fadeIn',
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            position: 'top-center',
            removeOnHover: false,
            attention: true,
            timeOut: 5000,
            escapeHtml: false,
        });
    },
    warning: (message) => {
        toastr.warning(DEFAULT_TITLE.FAIL, message, {
            closeButton: true,
            progressBar: false,
            showMethod: 'fadeIn',
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            position: 'top-right',
            timeOut: 5000,
            escapeHtml: false,
        });
    },

    result: (response, onSuccess, onFail) => {
        if (response && response.header) {
            const resultHeader = response.header;

            if (resultHeader.success) {
                toast.success(resultHeader.message || DEFAULT_SUCCESS_MSG);
                if (onSuccess) {
                    onSuccess(response);
                }
            } else {
                toast.fail(resultHeader.message || DEFAULT_ERROR_MSG);
                if (onFail) {
                    onFail(response);
                }
            }
        } else {
            toast.error(DEFAULT_NO_DATA);
            if (onFail) {
                onFail(response);
            }
        }
    },
};

export const messageBox = {
    alert: (message, ok) => {
        message = (message || '').replace(/\n/g, '<br />');
        const confirmOption = {
            disableCancel: true,
            okText: '확인',
            title: DEFAULT_TITLE.ALERT,
            onOk: () => {
                if (ok) {
                    ok(true);
                }
            },
            buttons: [
                {
                    text: '×',
                    className: 'close',
                    handler: () => {
                        if (ok) {
                            ok(true);
                        }
                    },
                },
                {
                    cancel: true, // move the cancel button to the end
                },
            ],
            component: () => <MokaMessageBox title={DEFAULT_TITLE.ALERT} message={message} />,
        };
        toastr.confirm('', confirmOption);
    },
    confirm: (message, ok, cancel) => {
        message = (message || '').replace(/\n/g, '<br />');
        const confirmOption = {
            closeButton: true,
            okText: '확인',
            cancelText: '취소',
            title: DEFAULT_TITLE.CONFIRM,
            onOk: () => {
                if (ok) {
                    ok(true);
                }
            },
            onCancel: () => {
                if (cancel) {
                    cancel(false);
                }
            },
            buttons: [
                {
                    text: '×',
                    className: 'close',
                    handler: () => {
                        if (cancel) {
                            cancel(false);
                        }
                    },
                },
                {
                    cancel: true, // move the cancel button to the end
                },
            ],
            component: () => <MokaMessageBox title={DEFAULT_TITLE.CONFIRM} headerClassName="confirm-header" message={message} />,
        };
        toastr.confirm('', confirmOption);
    },
};

export default toast;
