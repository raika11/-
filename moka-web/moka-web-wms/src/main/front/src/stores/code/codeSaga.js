import { takeLatest } from 'redux-saga/effects';
import { callApiWithParam, callApiAfterActions } from '~/stores/@common/createSaga';
import * as codeStore from './codeStore';
import * as codeAPI from '~/stores/api/codeAPI';

/**
 * 대분류 목록 조회
 */
export const getLargeCodesSaga = callApiWithParam(
    codeStore.GET_LARGE_CODES,
    codeAPI.getLargeCodes,
    {}
);

/**
 * 중분류 목록 조회
 */
export const getMiddleCodesSaga = callApiAfterActions(
    codeStore.GET_MIDDLE_CODES,
    codeAPI.getMiddleCodes,
    (state) => state.codeStore
);

/**
 * 소분류 목록 조회
 */
export const getSmallCodesSaga = callApiAfterActions(
    codeStore.GET_SMALL_CODES,
    codeAPI.getSmallCodes,
    (state) => state.codeStore
);

/**
 * 모든분류 목록 조회 */
export const getCodesSaga = callApiAfterActions(
    codeStore.GET_CODES,
    codeAPI.getSearchCodes,
    (state) => state.codeStore
);

export default function* codeSaga() {
    yield takeLatest(codeStore.GET_LARGE_CODES, getLargeCodesSaga);
    yield takeLatest(codeStore.GET_MIDDLE_CODES, getMiddleCodesSaga);
    yield takeLatest(codeStore.GET_SMALL_CODES, getSmallCodesSaga);
    yield takeLatest(codeStore.GET_CODES, getCodesSaga);
}
