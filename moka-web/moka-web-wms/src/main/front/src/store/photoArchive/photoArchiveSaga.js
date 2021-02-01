import { call, select, put, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '../commons/saga';
import * as api from './photoArchiveApi';
import * as act from './photoArchiveAction';

/**
 * 포토 아카이브 사진 목록 조회
 */
const getPhotoList = callApiAfterActions(act.GET_PHOTO_LIST, api.getPhotoList, (store) => store.photoArchive);

/**
 * 포토 아카이브 출처 목록 조회
 */
const getPhotoOrigins = createRequestSaga(act.GET_PHOTO_ORIGINS, api.getPhotoOrigins);

/**
 * 포토 아카이브 사진 유형 목록 조회
 */
const getPhotoTypes = createRequestSaga(act.GET_PHOTO_TYPES, api.getPhotoTypes);

/**
 * 포토 아카이브 사진 정보 조회
 */
const getPhoto = createRequestSaga(act.GET_PHOTO, api.getPhoto);

/**
 * 포토 아카이브 최초 목록 조회
 */
export function* getArchiveData() {
    try {
        const getOrigins = yield call(api.getPhotoOrigins);
        const getTypes = yield call(api.getPhotoTypes);
        const originList = yield select((store) => store.photoArchive.originList);
        const imageTypeList = yield select((store) => store.photoArchive.imageTypeList);
        const search = yield select((store) => store.photoArchive.search);
        const getList = yield call(api.getPhotoList, { ...search, originCode: 'all', imageType: 'All' });

        if (originList.length > 0 && imageTypeList.length > 0) {
            if (getList.data.header.success) {
                yield put({
                    type: act.GET_PHOTO_LIST_SUCCESS,
                    payload: getList.data,
                });
            }
        } else {
            yield put({
                type: act.GET_PHOTO_ORIGINS_SUCCESS,
                payload: getOrigins,
            });

            yield put({
                type: act.GET_PHOTO_TYPES_SUCCESS,
                payload: getTypes,
            });

            yield put({
                type: act.GET_PHOTO_LIST_SUCCESS,
                payload: getList.data,
            });
        }
    } catch (err) {}
}

/** saga */
export default function* photoArchiveSaga() {
    yield takeLatest(act.GET_PHOTO_LIST, getPhotoList);
    yield takeLatest(act.GET_PHOTO_ORIGINS, getPhotoOrigins);
    yield takeLatest(act.GET_PHOTO_TYPES, getPhotoTypes);
    yield takeLatest(act.GET_PHOTO, getPhoto);
    yield takeLatest(act.GET_ARCHIVE_DATA, getArchiveData);
}
