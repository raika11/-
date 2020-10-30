import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { API_BASE_URL, W3C_URL } from '@/constants';

import * as api from './mergeApi';
import * as act from './mergeAction';

// 미리보기 팝업띄움.
const popupPreview = (url, item) => {
    const targetUrl = `${API_BASE_URL}${url}`;

    // 폼 생성
    const f = document.createElement('form');
    f.setAttribute('method', 'post');
    f.setAttribute('action', targetUrl);
    f.setAttribute('target', '_blank');

    // eslint-disable-next-line no-restricted-syntax
    for (const propName in item) {
        if (typeof item[propName] === 'object') {
            const subObject = item[propName];
            // eslint-disable-next-line no-restricted-syntax
            for (const inPropName in subObject) {
                if (Object.prototype.hasOwnProperty.call(subObject, inPropName)) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = `${propName}.${inPropName}`;
                    input.value = item[propName][inPropName];
                    f.appendChild(input);
                }
            }
        } else if (Object.prototype.hasOwnProperty.call(item, propName)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = propName;
            input.value = item[propName];
            f.appendChild(input);
        }
    }

    document.getElementsByTagName('body')[0].appendChild(f);
    f.submit();
    f.remove();
};

/** saga */
export default function* mergeSaga() {
    // yield takeLatest(act.PREVIEW_PAGE, previewPageSaga);
    // yield takeLatest(act.PREVIEW_COMPONENT, previewComponentSaga);
    // yield takeLatest(act.W3C_PAGE, w3cPageSaga);
}
