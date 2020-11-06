import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { CODETYPE_LANG, CODETYPE_SERVICE_TYPE, CODETYPE_PAGE_TYPE, CODETYPE_TP_SIZE, CODETYPE_TP_ZONE, CODETYPE_API } from '@/constants';

import * as api from './codeMgtApi';
import * as act from './codeMgtAction';

/**
 * 코드 그룹 목록 조회
 */
export const getCodeMgtGrpList = callApiAfterActions(act.GET_CODE_MGT_GRP_LIST, api.getCodeMgtGrpList, (store) => store.codeMgt);

/**
 * 코드 목록 조회
 */
export const getCodeMgtList = callApiAfterActions(act.GET_CODE_MGT_LIST, api.getCodeMgtList, (store) => store.codeMgt);

/**
 * 그룹 조회
 */
const getCodeGrp = createRequestSaga(act.GET_CODE_MGT_GRP, api.getCodeMgtGrp);

/**
 * 코드 조회
 */
const getCode = createRequestSaga(act.GET_CODE_MGT, api.getCodeMgt);

/**
 * 그룹 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveCodeMgtGrpSaga({ payload: { type, actions, callback } }) {
    const ACTION = act.SAVE_CODE_MGT_GRP;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }
        const grp = yield select((state) => state.codeMgt.grp);
        const response = type === 'insert' ? yield call(api.postCodeMgtGrp, { grp }) : yield call(api.putCodeMgtGrp, { grp });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_CODE_MGT_GRP_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_CODE_MGT_GRP_LIST });
        } else {
            yield put({
                type: act.GET_CODE_MGT_GRP_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_CODE_MGT_GRP_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 그룹 삭제
 * @param {number} param0.payload.grpSeq 그룹 seq
 * @param {function} param0.payload.callback 콜백
 */
export function* deleteCodeMgtGrpSaga({ payload: { grpSeq, callback } }) {
    const ACTION = act.DELETE_CODE_MGT_GRP;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.deleteCodeMgtGrp, { grpSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({ type: act.DELETE_CODE_MGT_GRP_SUCCESS });

            // 목록 다시 검색
            yield put({ type: act.GET_CODE_MGT_GRP_LIST });
        } else {
            yield put({
                type: act.DELETE_CODE_MGT_GRP_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.DELETE_CODE_MGT_GRP_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 코드 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveCodeMgtSaga({ payload: { type, actions, callback } }) {
    const ACTION = act.SAVE_CODE_MGT;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }
        const cd = yield select((state) => state.codeMgt.cd);
        const grp = yield select((state) => state.codeMgt.grp);
        const response = type === 'insert' ? yield call(api.postCodeMgt, { cd: { ...cd, codeMgtGrp: grp } }) : yield call(api.putCodeMgt, { cd: { ...cd, codeMgtGrp: grp } });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_CODE_MGT_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_CODE_MGT_LIST });
        } else {
            yield put({
                type: act.GET_CODE_MGT_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_CODE_MGT_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 코드 삭제
 * @param {number} param0.payload.cdSeq 코드 seq
 * @param {function} param0.payload.callback 콜백
 */
export function* deleteCodeMgtSaga({ payload: { cdSeq, callback } }) {
    const ACTION = act.DELETE_CODE_MGT;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.deleteCodeMgt, { cdSeq });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({ type: act.DELETE_CODE_MGT_SUCCESS });

            // 목록 다시 검색
            yield put({ type: act.GET_CODE_MGT_LIST });
        } else {
            yield put({
                type: act.DELETE_CODE_MGT_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.DELETE_CODE_MGT_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 조회용 데이터 사가 생성함수
 * @param {string} actionType 액션명
 * @param {string} rowName initialState의 key 명칭
 * @param {string} grpCd grpCd
 */
function createReadOnlySaga(actionType, rowName, grpCd) {
    return function* () {
        yield put(startLoading(actionType));
        try {
            const response = yield call(api.getUseCodeMgtList, grpCd);
            if (response.data.header.success) {
                yield put({
                    type: act.READ_ONLY_SUCCESS,
                    payload: {
                        rowName,
                        body: response.data.body,
                    },
                });
            } else {
                yield put({
                    type: act.READ_ONLY_FAILURE,
                    payload: { rowName },
                });
            }
        } catch (e) {
            yield put({
                type: act.READ_ONLY_FAILURE,
                payload: { rowName },
            });
        }
        yield put(finishLoading(actionType));
    };
}
export const getTpSize = createReadOnlySaga(act.GET_TP_SIZE, 'tpSizeRows', CODETYPE_TP_SIZE);
export const getTpZone = createReadOnlySaga(act.GET_TP_ZONE, 'tpZoneRows', CODETYPE_TP_ZONE);
export const getLang = createReadOnlySaga(act.GET_LANG, 'langRows', CODETYPE_LANG);
export const getServiceType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'serviceTypeRows', CODETYPE_SERVICE_TYPE);
export const getPageType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'pageTypeRows', CODETYPE_PAGE_TYPE);
export const getApi = createReadOnlySaga(act.GET_API, 'apiRows', CODETYPE_API);

/** saga */
export default function* codeMgt() {
    yield takeLatest(act.GET_CODE_MGT_GRP_LIST, getCodeMgtGrpList);
    yield takeLatest(act.GET_CODE_MGT_LIST, getCodeMgtList);
    yield takeLatest(act.GET_CODE_MGT_GRP, getCodeGrp);
    yield takeLatest(act.GET_CODE_MGT, getCode);
    yield takeLatest(act.SAVE_CODE_MGT_GRP, saveCodeMgtGrpSaga);
    yield takeLatest(act.DELETE_CODE_MGT_GRP, deleteCodeMgtGrpSaga);
    yield takeLatest(act.SAVE_CODE_MGT, saveCodeMgtSaga);
    yield takeLatest(act.DELETE_CODE_MGT, deleteCodeMgtSaga);

    yield takeLatest(act.GET_TP_SIZE, getTpSize);
    yield takeLatest(act.GET_TP_ZONE, getTpZone);
    yield takeLatest(act.GET_LANG, getLang);
    yield takeLatest(act.GET_SERVICE_TYPE, getServiceType);
    yield takeLatest(act.GET_PAGE_TYPE, getPageType);
    yield takeLatest(act.GET_API, getApi);
}
