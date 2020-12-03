import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

import * as api from './photoArchiveApi';
import * as act from './photoArchiveAction';

/**
 * 포토 아카이브 사진 목록 조회
 */
export const getPhotoList = callApiAfterActions(act.GET_PHOTO_LIST, api.getPhotoList, (store) => store.photoArchive);

/**
 * 포토 아카이브 출처 목록 조회
 */
export const getPhotoOrigins = callApiAfterActions(act.GET_PHOTO_ORIGINS, api.getPhotoOrigins, (store) => store.photoArchive);

/**
 * 포토 아카이브 사진 유형 목록 조회
 */
const getPhotoTypes = createRequestSaga(act.GET_PHOTO_TYPES, api.getPhotoTypes);

/**
 * 포토 아카이브 사진 정보 조회
 */
const getPhoto = createRequestSaga(act.GET_PHOTO, api.getPhoto);

/** saga */
export default function* codeMgt() {
    yield takeLatest(act.GET_PHOTO_LIST, getPhotoList);
    yield takeLatest(act.GET_PHOTO_ORIGINS, getPhotoOrigins);
    yield takeLatest(act.GET_PHOTO_TYPES, getPhotoTypes);
    yield takeLatest(act.GET_PHOTO, getPhoto);
}
