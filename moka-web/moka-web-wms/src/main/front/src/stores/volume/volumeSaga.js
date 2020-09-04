import { takeLatest, put, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import createRequestSaga from '~/stores/@common/createRequestSaga';
import { callApiAfterActions } from '~/stores/@common/createSaga';
import * as volumeAPI from '~/stores/api/volumeAPI';
import * as volumeStore from './volumeStore';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';

let message = {};

/**
 * 목록
 */
const getVolumesSaga = callApiAfterActions(
    volumeStore.GET_VOLUMES,
    volumeAPI.getVolumes,
    (state) => state.volumeStore
);

/**
 * 조회
 */
const getVolumeSaga = createRequestSaga(volumeStore.GET_VOLUME, volumeAPI.getVolume);

/**
 * 추가/수정
 * @param {object} param0.payload.volume 추가/수정할 볼륨
 * @param {string} param0.payload.type insert|update
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
function* saveVolumeSaga({ payload: { type, volume, success, fail, error } }) {
    const ACTION = volumeStore.SAVE_VOLUME;
    message.key = `volumeSave${new Date().getTime() + Math.random()}`;
    message.message = '저장하지 못했습니다';
    message.options = { variant: 'error', persist: true };

    yield put(startLoading(ACTION));
    try {
        const response =
            type === 'insert'
                ? yield call(volumeAPI.postVolume, { volume })
                : yield call(volumeAPI.putVolume, { volume });

        if (response.data.header.success) {
            yield put({
                type: volumeStore.GET_VOLUME_SUCCESS,
                payload: response.data
            });
            // 목록 다시 검색
            yield put({ type: volumeStore.GET_VOLUMES });
            message.message = type === 'insert' ? '등록하였습니다' : '수정하였습니다';
            message.options = { variant: 'success', persist: false };
            if (typeof success === 'function') success(response.data.body);
        } else {
            yield put({
                type: volumeStore.GET_VOLUME_FAILURE,
                payload: response.data
            });
            message.message = response.data.header.message || message.message;
            if (typeof fail === 'function') fail(response.data);
        }
    } catch (e) {
        yield put({
            type: volumeStore.GET_VOLUME_FAILURE,
            payload: e
        });
        if (typeof error === 'function') error(e);
    }
    yield put(finishLoading(ACTION));
    yield put(enqueueSnackbar(message));
}

/**
 * 관련데이터 확인
 * @param {string} param0.payload.volumeId 볼륨 아이디
 * @param {func} param0.payload.exist 관련데이터 o 콜백
 * @param {func} param0.payload.notExist 관련데이터 x 콜백
 */
function* hasRelationsSaga({ payload: { volumeId, exist, notExist } }) {
    const ACTION = volumeStore.HAS_RELATIONS;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(volumeAPI.hasRelations, { volumeId });
        if (response.data.header.success) {
            if (response.data.body) {
                if (typeof exist === 'function') exist(true);
            } else {
                if (typeof notExist === 'function') notExist(false);
            }
        }
        // eslint-disable-next-line no-empty
    } catch (e) {}
    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string} param0.payload.volumeId 볼륨 아이디
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
function* deleteVolumeSaga({ payload: { volumeId, success, fail, error } }) {
    const ACTION = volumeStore.DELETE_VOLUME;
    message.key = `volumeDel${new Date().getTime() + Math.random()}`;
    message.message = '삭제하지 못했습니다';
    message.options = { variant: 'error', persist: true };

    yield put(startLoading(ACTION));
    try {
        const response = yield call(volumeAPI.deleteVolume, { volumeId });

        if (response.data.header.success) {
            yield put({ type: volumeStore.DELETE_VOLUME_SUCCESS });
            // 목록 다시 검색
            yield put({ type: volumeStore.GET_VOLUMES });
            message.message = '삭제하였습니다';
            message.options = { variant: 'success', persist: false };
            if (typeof success === 'function') success(response.data.body);
        } else {
            yield put({
                type: volumeStore.DELETE_VOLUME_FAILURE,
                payload: response.data
            });
            message.message = response.data.header.message;
            if (typeof fail === 'function') fail(response.data);
        }
    } catch (e) {
        yield put({
            type: volumeStore.DELETE_VOLUME_FAILURE,
            payload: e
        });
        if (typeof error === 'function') error(e);
    }
    yield put(finishLoading(ACTION));
    yield put(enqueueSnackbar(message));
}

/**
 * 볼륨 데이터 클리어
 * @param {object} param0.payload search|list|detail
 */
function* clearVolumeSaga({ payload }) {
    if (!payload || payload.search) {
        yield put({
            type: volumeStore.CLEAR_SEARCH_OPTION
        });
    }

    if (!payload || payload.list) {
        yield put({
            type: volumeStore.CLEAR_VOLUME_LIST
        });
    }

    if (!payload || payload.detail) {
        yield put({
            type: volumeStore.CLEAR_VOLUME_DETAIL
        });
    }
}

export default function* volumeSaga() {
    yield takeLatest(volumeStore.GET_VOLUMES, getVolumesSaga);
    yield takeLatest(volumeStore.GET_VOLUME, getVolumeSaga);
    yield takeLatest(volumeStore.SAVE_VOLUME, saveVolumeSaga);
    yield takeLatest(volumeStore.CLEAR_VOLUME, clearVolumeSaga);
    yield takeLatest(volumeStore.DELETE_VOLUME, deleteVolumeSaga);
    yield takeLatest(volumeStore.HAS_RELATIONS, hasRelationsSaga);
}
