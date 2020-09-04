import { takeLatest, call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import { API_BASE_URL, W3C_URL } from '~/constants';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as mergeStore from './mergeStore';
import * as mergeAPI from '~/stores/api/mergeAPI';

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

function* previewPageSaga(action) {
    let resultMessage = {
        key: `merge${new Date().getTime() + Math.random()}`,
        message: '미리보기에 실패했습니다.',
        options: { variant: 'error', persist: true }
    };

    yield put(startLoading(mergeStore.PREVIEW_PAGE)); // 로딩 시작
    try {
        const response = yield call(mergeAPI.postSyntax, action.payload.content);
        if (response.data.header.success) {
            yield put({
                type: mergeStore.PREVIEW_PAGE_SUCCESS,
                payload: response.data,
                meta: response
            });
            resultMessage.options = { variant: 'success' };

            // 팝업
            popupPreview(action.payload.url, action.payload.page);
        } else {
            yield put({
                type: mergeStore.PREVIEW_PAGE_FAILURE,
                payload: response.data,
                error: true
            });
            resultMessage.message = '문법에 오류가 있어 미리보기에 실패했습니다.';
        }
    } catch (e) {
        yield put({
            type: mergeStore.PREVIEW_PAGE_FAILURE,
            payload: e,
            error: true
        });
        resultMessage.message = '미리보기에 실패했습니다.';
    }
    yield put(finishLoading(mergeStore.PREVIEW_PAGE)); // 로딩 끝

    // 메세지박스 노출
    if (resultMessage.options.variant === 'error') {
        yield put(enqueueSnackbar(resultMessage));
    }
}

function* previewComponentSaga(action) {
    let resultMessage = {
        key: `merge${new Date().getTime() + Math.random()}`,
        message: '컴포넌트 미리보기에 실패했습니다.',
        options: { variant: 'error', persist: true }
    };

    yield put(startLoading(mergeStore.PREVIEW_COMPONENT)); // 로딩 시작
    try {
        const response = yield call(mergeAPI.getPreviewCP, action.payload);
        if (response.data.header.success) {
            yield put({
                type: mergeStore.PREVIEW_COMPONENT_SUCCESS,
                payload: response.data,
            });
            resultMessage.options = { variant: 'success' };
        } else {
            yield put({
                type: mergeStore.PREVIEW_COMPONENT_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: mergeStore.PREVIEW_COMPONENT_FAILURE,
            payload: e,
            error: true
        });
        resultMessage.message = '컴포넌트 미리보기에 실패했습니다.';
    }
    yield put(finishLoading(mergeStore.PREVIEW_COMPONENT)); // 로딩 끝

    // 메세지박스 노출
    if (resultMessage.options.variant === 'error') {
        yield put(enqueueSnackbar(resultMessage));
    }
}

// W3C 팝업띄움.
const popupW3C = (body) => {
    const targetUrl = W3C_URL;

    // 폼 생성
    const f = document.createElement('form');
    f.setAttribute('method', 'post');
    f.setAttribute('action', targetUrl);
    f.setAttribute('target', '_blank');
    f.setAttribute('enctype', 'multipart/form-data');

    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'fragment';
    input.value = body;
    f.appendChild(input);
    document.getElementsByTagName('body')[0].appendChild(f);
    f.submit();
    f.remove();
};

function* w3cPageSaga(action) {
    let resultMessage = {
        key: `merge${new Date().getTime() + Math.random()}`,
        message: 'W3C검사에 실패했습니다.',
        options: { variant: 'error', persist: true }
    };

    yield put(startLoading(mergeStore.W3C_PAGE)); // 로딩 시작
    try {
        const resSyntax = yield call(mergeAPI.postSyntax, action.payload.content);
        if (resSyntax.data.header.success) {
            // 랜더링된 html받아온다
            const resPreview = yield call(mergeAPI.postPreviewPG, action.payload.page);
            if (resPreview.data.header.success) {
                yield put({
                    type: mergeStore.W3C_PAGE_SUCCESS,
                    payload: resPreview.data
                });
                resultMessage.options = { variant: 'success' };

                const { body } = resPreview.data;

                // W3C 팝업
                popupW3C(body);
            } else {
                yield put({
                    type: mergeStore.W3C_PAGE_FAILURE,
                    payload: resPreview.data,
                    error: true
                });
                resultMessage.message = '랜더링에 오류가 있어 W3C검사에 실패했습니다.';
            }
        } else {
            yield put({
                type: mergeStore.W3C_PAGE_FAILURE,
                payload: resSyntax.data,
                error: true
            });
            resultMessage.message = '문법에 오류가 있어 W3C검사에 실패했습니다.';
        }
    } catch (e) {
        yield put({
            type: mergeStore.W3C_PAGE_FAILURE,
            payload: e,
            error: true
        });
        resultMessage.message = 'W3C검사에 실패했습니다.';
        resultMessage.options = { variant: 'error' };
    }
    yield put(finishLoading(mergeStore.W3C_PAGE)); // 로딩 끝

    // 메세지박스 노출
    if (resultMessage.options.variant === 'error') {
        yield put(enqueueSnackbar(resultMessage));
    }
}

function* mergeSaga() {
    yield takeLatest(mergeStore.PREVIEW_PAGE, previewPageSaga);
    yield takeLatest(mergeStore.PREVIEW_COMPONENT, previewComponentSaga);
    yield takeLatest(mergeStore.W3C_PAGE, w3cPageSaga);
}

export default mergeSaga;
