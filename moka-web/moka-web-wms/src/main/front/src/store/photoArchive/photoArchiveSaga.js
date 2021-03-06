import { call, select, put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import { callApiAfterActions, createRequestSaga } from '../commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './photoArchiveApi';
import * as act from './photoArchiveAction';
import { DB_DATEFORMAT } from '@/constants';

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
 * (origin, type 조회 + 리스트 조회)
 */
export function* getArchiveData() {
    yield put(startLoading(act.GET_ARCHIVE_DATA));

    try {
        const getOrigins = yield call(api.getPhotoOrigins);
        const getTypes = yield call(api.getPhotoTypes);

        if (getOrigins.data.header.success && getTypes.data.header.success) {
            yield put({
                type: act.GET_PHOTO_ORIGINS_SUCCESS,
                payload: getOrigins.data,
            });
            yield put({
                type: act.GET_PHOTO_TYPES_SUCCESS,
                payload: getTypes.data,
            });

            const search = yield select((store) => store.photoArchive.search);
            // 기본 검색조건 설정
            const nt = new Date();
            const option = {
                ...search,
                startdate: moment(nt).startOf('day').format(DB_DATEFORMAT),
                finishdate: moment(nt).endOf('day').format(DB_DATEFORMAT),
                imageType: 'All',
                originCode: 'all',
            };
            yield put({
                type: act.CHANGE_SEARCH_OPTION,
                payload: option,
            });

            const getList = yield call(api.getPhotoList, { search: option });

            if (getList.data.header.success) {
                yield put({
                    type: act.GET_PHOTO_LIST_SUCCESS,
                    payload: getList.data,
                });
            } else {
                // 실패 액션
            }
        } else {
            // origin, type 조회 실패
            // 실패 액션
        }
    } catch (err) {}

    yield put(finishLoading(act.GET_ARCHIVE_DATA));
}

/** saga */
export default function* photoArchiveSaga() {
    yield takeLatest(act.GET_PHOTO_LIST, getPhotoList);
    yield takeLatest(act.GET_PHOTO_ORIGINS, getPhotoOrigins);
    yield takeLatest(act.GET_PHOTO_TYPES, getPhotoTypes);
    yield takeLatest(act.GET_PHOTO, getPhoto);
    yield takeLatest(act.GET_ARCHIVE_DATA, getArchiveData);
}
