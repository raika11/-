import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 포토 아카이브 사진 목록 조회
 */
export const [GET_PHOTO_LIST, GET_PHOTO_LIST_SUCCESS, GET_PHOTO_LIST_FAILURE] = createRequestActionTypes('photoArchive/GET_PHOTO_LIST');
export const getPhotoList = createAction(GET_PHOTO_LIST, (...actions) => actions);

/**
 * 포토 아카이브 출처 목록 조회
 */
export const GET_PHOTO_ORIGINS = 'photoArchive/GET_PHOTO_ORIGINS';
export const getPhotoOrigins = createAction(GET_PHOTO_ORIGINS, (payload) => payload);

/**
 * 포토 아카이브 사진 유형 목록 조회
 */
export const GET_PHOTO_TYPES = 'photoArchive/GET_PHOTO_TYPES';
export const getPhotoTypes = createAction(GET_PHOTO_TYPES, (payload) => payload);

/**
 * 포토 아카이브 사진 정보 조회
 */
export const [GET_PHOTO, GET_PHOTO_SUCCESS, GET_PHOTO_FAILURE] = createRequestActionTypes('photoArchive/GET_PHOTO');
export const getPhoto = createAction(GET_PHOTO, (payload) => payload);
