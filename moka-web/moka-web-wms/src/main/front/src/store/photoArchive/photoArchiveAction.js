import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'photoArchive/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'photoArchive/CLEAR_STORE';
export const CLEAR_LIST = 'photoArchive/CLEAR_LIST';
export const CLEAR_SEARCH = 'photoArchive/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 포토 아카이브 사진 목록 조회
 */
export const [GET_PHOTO_LIST, GET_PHOTO_LIST_SUCCESS, GET_PHOTO_LIST_FAILURE] = createRequestActionTypes('photoArchive/GET_PHOTO_LIST');
export const getPhotoList = createAction(GET_PHOTO_LIST, (...actions) => actions);

/**
 * 포토 아카이브 출처 목록 조회
 */
export const [GET_PHOTO_ORIGINS, GET_PHOTO_ORIGINS_SUCCESS, GET_PHOTO_ORIGINS_FAILURE] = createRequestActionTypes('photoArchive/GET_PHOTO_ORIGINS');
export const getPhotoOrigins = createAction(GET_PHOTO_ORIGINS, () => ({}));

/**
 * 포토 아카이브 사진 유형 목록 조회
 */
export const [GET_PHOTO_TYPES, GET_PHOTO_TYPES_SUCCESS, GET_PHOTO_TYPES_FAILURE] = createRequestActionTypes('photoArchive/GET_PHOTO_TYPES');
export const getPhotoTypes = createAction(GET_PHOTO_TYPES, () => ({}));

/**
 * 포토 아카이브 사진 정보 조회
 */
export const [GET_PHOTO, GET_PHOTO_SUCCESS, GET_PHOTO_FAILURE] = createRequestActionTypes('photoArchive/GET_PHOTO');
export const getPhoto = createAction(GET_PHOTO, (photoId) => photoId);

/**
 * 포토 아카이브 사진 목록 출처, 유형 목록 조회한 후 실행
 */
export const GET_ARCHIVE_DATA = 'photoArchive/GET_ARCHIVE_DATA';
export const getArchiveData = createAction(GET_ARCHIVE_DATA);
