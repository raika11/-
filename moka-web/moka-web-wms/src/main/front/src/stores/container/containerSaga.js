import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import createListSaga from '~/stores/@common/createListSaga';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as authStore from '../auth/authStore';
import * as containerAPI from '~/stores/api/containerAPI';
import * as containerStore from './containerStore';

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
function* getContainerSaga(action) {
    let resultMessage = {
        key: `container${new Date().getTime() + Math.random()}`,
        message: '컨테이너를 조회하지 못했습니다.',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { containerSeq, callback, direct = false } = action.payload;

    yield put(startLoading(containerStore.GET_CONTAINER)); // 로딩 시작
    try {
        const response = yield call(containerAPI.getContainer, containerSeq);
        if (response.data.header.success) {
            yield put({
                type: containerStore.GET_CONTAINER_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '조회하였습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;

            // direct로딩시 latestMediaId, latestDomainId수정
            if (direct) {
                yield* changeDomainId(response.data.body);
            }
        } else {
            yield put({
                type: containerStore.GET_CONTAINER_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: containerStore.GET_CONTAINER_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(containerStore.GET_CONTAINER)); // 로딩 끝

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
function* postContainerSaga(action) {
    let resultMessage = {
        key: `container${new Date().getTime() + Math.random()}`,
        message: '저장하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { container, callback } = action.payload;

    yield put(startLoading(containerStore.POST_CONTAINER)); // 로딩 시작
    try {
        // 1. 페이지 등록
        const containerBody = yield select((state) => state.containerStore.containerBody);
        const response = yield call(containerAPI.postContainer, {
            container: { ...container, containerBody }
        });
        if (response.data.header.success) {
            yield put({
                type: containerStore.POST_CONTAINER_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '저장되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: containerStore.POST_CONTAINER_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: containerStore.POST_CONTAINER_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(containerStore.POST_CONTAINER)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 수정
 */
function* putContainerSaga(action) {
    let resultMessage = {
        key: `container${new Date().getTime() + Math.random()}`,
        message: '수정하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { container, callback } = action.payload;

    yield put(startLoading(containerStore.PUT_CONTAINER)); // 로딩 시작
    try {
        // 1. 수정
        const containerBody = yield select((state) => state.containerStore.containerBody);
        const response = yield call(containerAPI.putContainer, {
            container: { ...container, containerBody }
        });
        if (response.data.header.success) {
            yield put({
                type: containerStore.PUT_CONTAINER_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '수정되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: containerStore.PUT_CONTAINER_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: containerStore.PUT_CONTAINER_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(containerStore.PUT_CONTAINER)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 삭제
 */
function* deleteContainerSaga(action) {
    let resultMessage = {
        key: `container${new Date().getTime() + Math.random()}`,
        message: '삭제하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    const { containerSeq, callback } = action.payload;

    yield put(startLoading(containerStore.DELETE_CONTAINER)); // 로딩 시작
    try {
        // 1. 삭제
        const response = yield call(containerAPI.deleteContainer, containerSeq);
        if (response.data.header.success) {
            yield put({
                type: containerStore.DELETE_CONTAINER_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '삭제되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;
        } else {
            yield put({
                type: containerStore.DELETE_CONTAINER_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: containerStore.DELETE_CONTAINER_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(containerStore.DELETE_CONTAINER)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 관련 아이템 체크
 */
export function* hasRelationsSaga(action) {
    const { containerSeq, callback } = action.payload;
    yield put(startLoading(containerStore.HAS_RELATIONS));
    try {
        const result = yield call(containerAPI.hasRelations, containerSeq);
        if (result.data.header.success && typeof callback === 'function') {
            yield call(callback, !!result.data.body);
        }
    } catch (e) {
        if (typeof callback === 'function') {
            yield call(callback, false);
        }
    }
    yield put(finishLoading(containerStore.HAS_RELATIONS));
}

const getContainerListSaga = createListSaga(
    containerStore.GET_CONTAINER_LIST,
    containerAPI.getContainerList,
    containerStore.CHANGE_SEARCH_OPTION,
    (state) => state.containerStore
);

function* containerSaga() {
    yield takeLatest(containerStore.GET_CONTAINER_LIST, getContainerListSaga);
    yield takeLatest(containerStore.GET_CONTAINER, getContainerSaga);
    yield takeLatest(containerStore.POST_CONTAINER, postContainerSaga);
    yield takeLatest(containerStore.PUT_CONTAINER, putContainerSaga);
    yield takeLatest(containerStore.DELETE_CONTAINER, deleteContainerSaga);
    yield takeLatest(containerStore.HAS_RELATIONS, hasRelationsSaga);
}

export default containerSaga;
