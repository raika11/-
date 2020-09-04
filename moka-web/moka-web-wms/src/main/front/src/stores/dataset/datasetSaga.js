import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import createListSaga from '~/stores/@common/createListSaga';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as datasetAPI from '~/stores/api/datasetAPI';
import * as datasetStore from './datasetStore';

/**
 * 다이렉트 로딩시 ApiCodeId 수정
 * @param {} dataset 조회된 객체
 */
function* changeApiCodeId(dataset) {
    const latestSearch = yield select((state) => state.datasetStore.search);

    const realId = dataset.apiCodeId;
    if (latestSearch.apiCodeId !== realId) {
        const option = {
            ...latestSearch,
            apiCodeId: dataset.apiCodeId,
            apiHost: dataset.dataApiHost,
            apiPath: dataset.dataApiPath
        };
        yield put({
            type: datasetStore.CHANGE_SEARCH_OPTION,
            payload: option
        });
    }
}

/**
 * 상세조회
 */
function* getDatasetSaga(action) {
    let resultMessage = {
        key: `dataset${new Date().getTime() + Math.random()}`,
        message: '데이타셋을 조회하지 못했습니다.',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { datasetSeq, callback, direct = false } = action.payload;

    yield put(startLoading(datasetStore.GET_DATASET)); // 로딩 시작
    try {
        const response = yield call(datasetAPI.getDataset, datasetSeq);

        if (response.data.header.success) {
            yield put({
                type: datasetStore.GET_DATASET_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '조회하였습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;

            // direct로딩시 apiCodeId 수정
            if (direct) {
                yield* changeApiCodeId(response.data.body);
            }
        } else {
            yield put({
                type: datasetStore.GET_DATASET_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: datasetStore.GET_DATASET_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(datasetStore.GET_DATASET)); // 로딩 끝

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
function* postDatasetSaga(action) {
    let resultMessage = {
        key: `dataset${new Date().getTime() + Math.random()}`,
        message: '저장하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { dataset, callback } = action.payload;

    yield put(startLoading(datasetStore.POST_DATASET)); // 로딩 시작
    try {
        // 0. 파라미터 데이타구조 문자열로 변경
        if (dataset.dataApiParamShape) {
            dataset.dataApiParamShape = null;
        }
        if (dataset.dataApiParam) {
            dataset.dataApiParam = JSON.stringify(dataset.dataApiParam);
        }

        // 1. 데이타셋 등록
        const response = yield call(datasetAPI.postDataset, { dataset });
        if (response.data.header.success) {
            yield put({
                type: datasetStore.POST_DATASET_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '저장되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: datasetStore.POST_DATASET_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: datasetStore.POST_DATASET_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(datasetStore.POST_DATASET)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 수정
 */
function* putDatasetSaga(action) {
    let resultMessage = {
        key: `dataset${new Date().getTime() + Math.random()}`,
        message: '수정하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { dataset, callback } = action.payload;

    yield put(startLoading(datasetStore.PUT_DATASET)); // 로딩 시작
    try {
        // 0. 파라미터 데이타구조 문자열로 변경
        if (dataset.dataApiParamShape) {
            dataset.dataApiParamShape = null;
        }
        if (dataset.dataApiParam) {
            dataset.dataApiParam = JSON.stringify(dataset.dataApiParam);
        }

        // 1. 데이타셋 수정
        const response = yield call(datasetAPI.putDataset, { dataset });
        if (response.data.header.success) {
            yield put({
                type: datasetStore.PUT_DATASET_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '수정되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: datasetStore.PUT_DATASET_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: datasetStore.PUT_DATASET_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(datasetStore.PUT_DATASET)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 삭제
 */
function* deleteDatasetSaga(action) {
    let resultMessage = {
        key: `dataset${new Date().getTime() + Math.random()}`,
        message: '삭제하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    const { datasetSeq, callback } = action.payload;

    yield put(startLoading(datasetStore.DELETE_DATASET)); // 로딩 시작
    try {
        // 1. 데이타셋 삭제
        const response = yield call(datasetAPI.deleteDataset, datasetSeq);
        if (response.data.header.success) {
            yield put({
                type: datasetStore.DELETE_DATASET_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '삭제되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;
        } else {
            yield put({
                type: datasetStore.DELETE_DATASET_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: datasetStore.DELETE_DATASET_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(datasetStore.DELETE_DATASET)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 관련 아이템 체크
 */
export function* hasRelationsSaga(action) {
    const { datasetSeq, callback } = action.payload;
    yield put(startLoading(datasetStore.HAS_RELATIONS));
    try {
        const result = yield call(datasetAPI.hasRelations, datasetSeq);
        if (result.data.header.success && typeof callback === 'function') {
            yield call(callback, !!result.data.body);
        }
    } catch (e) {
        if (typeof callback === 'function') {
            yield call(callback, false);
        }
    }
    yield put(finishLoading(datasetStore.HAS_RELATIONS));
}

/**
 * 복사
 */
function* copyDatasetSaga(action) {
    let resultMessage = {
        key: `dataset${new Date().getTime() + Math.random()}`,
        message: '복사하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { datasetSeq, datasetName, callback } = action.payload;

    yield put(startLoading(datasetStore.COPY_DATASET)); // 로딩 시작
    try {
        // 1. 데이타셋 등록
        const response = yield call(datasetAPI.copyDataset, { datasetSeq, datasetName });
        if (response.data.header.success) {
            yield put({
                type: datasetStore.COPY_DATASET_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '저장되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: datasetStore.COPY_DATASET_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: datasetStore.COPY_DATASET_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(datasetStore.COPY_DATASET)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

const getDatasetListSaga = createListSaga(
    datasetStore.GET_DATASET_LIST,
    datasetAPI.getDatasetList,
    datasetStore.CHANGE_SEARCH_OPTION,
    (state) => state.datasetStore
);

// saga watcher
function* datasetSaga() {
    yield takeLatest(datasetStore.GET_DATASET_LIST, getDatasetListSaga);
    yield takeLatest(datasetStore.GET_DATASET, getDatasetSaga);
    yield takeLatest(datasetStore.POST_DATASET, postDatasetSaga);
    yield takeLatest(datasetStore.PUT_DATASET, putDatasetSaga);
    yield takeLatest(datasetStore.DELETE_DATASET, deleteDatasetSaga);
    yield takeLatest(datasetStore.HAS_RELATIONS, hasRelationsSaga);
    yield takeLatest(datasetStore.COPY_DATASET, copyDatasetSaga);
}

export default datasetSaga;
