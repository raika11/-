import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import createListSaga from '~/stores/@common/createListSaga';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as authStore from '../auth/authStore';
import * as pageAPI from '~/stores/api/pageAPI';
import * as pageStore from './pageStore';

/**
 * 다이렉트 로딩시 도메인 수정
 * @param {} page 조회된 객체
 */
function* changeDomainId(page) {
    const latestMediaId = yield select((state) => state.authStore.latestMediaId);
    const latestDomainId = yield select((state) => state.authStore.latestDomainId);
    const { mediaId: mId, domainId: dId } = page.domain;

    if (latestDomainId !== dId) {
        if (latestMediaId !== mId) {
            yield put({
                type: authStore.CHANGE_LATEST_MEDIAID,
                payload: { mediaId: mId, domainId: dId }
            });
        } else {
            yield put({
                type: authStore.CHANGE_LATEST_DOMAINID,
                payload: dId
            });
        }
    }
}

/**
 * 상세조회
 */
function* getPageSaga(action) {
    let resultMessage = {
        key: `page${new Date().getTime() + Math.random()}`,
        message: '페이지를 조회하지 못했습니다.',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { pageSeq, direct = false, callback } = action.payload;

    yield put(startLoading(pageStore.GET_PAGE)); // 로딩 시작
    try {
        const response = yield call(pageAPI.getPage, pageSeq);

        if (response.data.header.success) {
            yield put({
                type: pageStore.GET_PAGE_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '조회하였습니다';
            resultMessage.options = { variant: 'success' };

            // direct로딩시 latestMediaId, latestDomainId수정
            if (direct) {
                yield* changeDomainId(response.data.body);
            }
        } else {
            yield put({
                type: pageStore.GET_PAGE_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: pageStore.GET_PAGE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(pageStore.GET_PAGE)); // 로딩 끝

    // 메세지박스 노출
    if (resultMessage.options.variant === 'error') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 등록
 */
function* postPageSaga(action) {
    let resultMessage = {
        key: `page${new Date().getTime() + Math.random()}`,
        message: '저장하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { page, callback } = action.payload;

    yield put(startLoading(pageStore.POST_PAGE)); // 로딩 시작
    try {
        // 1. 페이지 등록
        const pageBody = yield select((state) => state.pageStore.pageBody);
        const response = yield call(pageAPI.postPage, { page: { ...page, pageBody } });
        if (response.data.header.success) {
            yield put({
                type: pageStore.POST_PAGE_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '저장되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: pageStore.POST_PAGE_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: pageStore.POST_PAGE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(pageStore.POST_PAGE)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 수정
 */
function* putPageSaga(action) {
    let resultMessage = {
        key: `page${new Date().getTime() + Math.random()}`,
        message: '수정하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { page, callback } = action.payload;

    yield put(startLoading(pageStore.PUT_PAGE)); // 로딩 시작
    try {
        // 1. 수정
        const pageBody = yield select((state) => state.pageStore.pageBody);
        const response = yield call(pageAPI.putPage, { page: { ...page, pageBody } });
        if (response.data.header.success) {
            yield put({
                type: pageStore.PUT_PAGE_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '수정되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: pageStore.PUT_PAGE_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: pageStore.PUT_PAGE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(pageStore.PUT_PAGE)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 삭제
 */
function* deletePageSaga(action) {
    let resultMessage = {
        key: `page${new Date().getTime() + Math.random()}`,
        message: '삭제하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    const { pageSeq, callback } = action.payload;

    yield put(startLoading(pageStore.DELETE_PAGE)); // 로딩 시작
    try {
        // 1. 페이지 삭제
        const response = yield call(pageAPI.deletePage, pageSeq);
        if (response.data.header.success) {
            yield put({
                type: pageStore.DELETE_PAGE_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '삭제되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;
        } else {
            yield put({
                type: pageStore.DELETE_PAGE_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: pageStore.DELETE_PAGE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(pageStore.DELETE_PAGE)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 퍼지
 */
function* getPurgeSaga(action) {
    let resultMessage = {
        key: `page${new Date().getTime() + Math.random()}`,
        message: '즉시반영하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };

    yield put(startLoading(pageStore.GET_PURGE)); // 로딩 시작
    try {
        // 1. 퍼지
        const response = yield call(pageAPI.getPurge, action.payload);
        if (response.data.header.success) {
            yield put({
                type: pageStore.GET_PURGE_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '즉시반영되었습니다';
            resultMessage.options = { variant: 'success' };
        } else {
            yield put({
                type: pageStore.GET_PURGE_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: pageStore.GET_PURGE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(pageStore.GET_PURGE)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));
}

const getPageTreeSaga = createListSaga(
    pageStore.GET_PAGE_TREE,
    pageAPI.getPageTree,
    pageStore.CHANGE_SEARCH_OPTION,
    (state) => state.pageStore
);

// saga watcher
function* pageSaga() {
    yield takeLatest(pageStore.GET_PAGE_TREE, getPageTreeSaga);
    yield takeLatest(pageStore.GET_PAGE, getPageSaga);
    yield takeLatest(pageStore.POST_PAGE, postPageSaga);
    yield takeLatest(pageStore.PUT_PAGE, putPageSaga);
    yield takeLatest(pageStore.DELETE_PAGE, deletePageSaga);
    yield takeLatest(pageStore.GET_PURGE, getPurgeSaga);
}

export default pageSaga;
