import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as constants from '@/constants';
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
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_GRP_INVALID_LIST,
                    payload: response.data.body.list,
                });
            }
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
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_CD_INVALID_LIST,
                    payload: response.data.body.list,
                });
            }
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

/**
 * 코드 그룹 중복체크
 * @param {string} param0.payload.grpCd 코드 그룹 이름
 * @param {string} param0.payload.callback callback
 */
function* getCodeMgtGrpDuplicateCheck({ payload: { grpCd, callback } }) {
    const ACTION = act.GET_CODE_MGT_GRP_DUPLICATE_CHECK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.getCodeMgtGrpDuplicateCheck, { grpCd, callback });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 코드 중복 체크
 * @param {string} param0.payload.grpCd 코드 그룹 이름
 * @param {string} param0.payload.dtlCd 코드 이름
 * @param {string} param0.payload.callback callback
 */
function* getCodeMgtDuplicateCheck({ payload: { grpCd, dtlCd, callback } }) {
    const ACTION = act.GET_CODE_MGT_DUPLICATE_CHECK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(api.getCodeMgtDuplicateCheck, { grpCd, dtlCd, callback });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

function* getSpecialCharCode({ type, payload: { grpCd, dtlCd } }) {
    try {
        const response = yield call(api.getSpecialCharCode, { grpCd, dtlCd });
        if (response.data.header.success) {
            yield put({
                type: `${type}_SUCCESS`,
                payload: response.data.body,
            });
        } else {
            yield put({
                type: `${type}_FAILURE`,
                payload: response.data.body,
            });
        }
    } catch (e) {
        yield put({
            type: `${type}_FAILURE`,
            payload: errorResponse(e),
        });
    }
}

function* putSpecialCharCode({ type, payload: { grpCd, dtlCd, cdNm, callback } }) {
    try {
        const response = yield call(api.putSpecialCharCode, { grpCd, dtlCd, cdNm });
        if (response.data.header.success) {
            yield put({
                type: act.GET_SPECIAL_CHAR_CODE_SUCCESS,
                payload: response.data.body,
            });
        } else {
            yield put({
                type: act.GET_SPECIAL_CHAR_CODE_FAILURE,
                payload: response.data.body,
            });
        }
        //callback({ ...response.data, header: { ...response.data.header, success: false } });
        callback(response.data);
    } catch (e) {
        yield put({
            type: act.GET_SPECIAL_CHAR_CODE_FAILURE,
            payload: errorResponse(e),
        });
    }
}

export const getTpSize = createReadOnlySaga(act.GET_TP_SIZE, 'tpSizeRows', constants.CODETYPE_TP_SIZE);
export const getTpZone = createReadOnlySaga(act.GET_TP_ZONE, 'tpZoneRows', constants.CODETYPE_TP_ZONE);
export const getLang = createReadOnlySaga(act.GET_LANG, 'langRows', constants.CODETYPE_LANG);
export const getServiceType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'serviceTypeRows', constants.CODETYPE_SERVICE_TYPE);
export const getPageType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'pageTypeRows', constants.CODETYPE_PAGE_TYPE);
export const getApi = createReadOnlySaga(act.GET_API, 'apiRows', constants.CODETYPE_API);
export const getArtGroup = createReadOnlySaga(act.GET_ART_GROUP, 'artGroupRows', constants.CODETYPE_ART_GROUP);
export const getBulkChar = createReadOnlySaga(act.GET_BULK_CHAR, 'bulkCharRows', constants.CODETYPE_SPECIALCHAR);
export const getDsFontImgD = createReadOnlySaga(act.GET_DS_FONT_IMGD, 'dsFontImgDRows', constants.CODETYPE_DS_FONT_IMGD);
export const getDsFontImgW = createReadOnlySaga(act.GET_DS_FONT_IMGW, 'dsFontImgWRows', constants.CODETYPE_DS_FONT_IMGW);
export const getDsFontVodD = createReadOnlySaga(act.GET_DS_FONT_VODD, 'dsFontVodDRows', constants.CODETYPE_DS_FONT_VODD);
export const getDsTitleLoc = createReadOnlySaga(act.GET_DS_TITLE_LOC, 'dsTitleLocRows', constants.CODETYPE_DS_TITLE_LOC);
export const getDsPre = createReadOnlySaga(act.GET_DS_PRE, 'dsPreRows', constants.CODETYPE_DS_PRE);
export const getDsPreLoc = createReadOnlySaga(act.GET_DS_PRE_LOC, 'dsPreLocRows', constants.CODETYPE_DS_PRE_LOC);
export const getDsIcon = createReadOnlySaga(act.GET_DS_ICON, 'dsIconRows', constants.CODETYPE_DS_ICON);
export const getArticleType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'articleTypeRows', constants.CODETYPE_ARTICLE_TYPE);
export const getPt = createReadOnlySaga(act.GET_PT, 'ptRows', constants.CODETYPE_PT);
export const getChannelTp = createReadOnlySaga(act.GET_CHANNEL_TP, 'channelTpRows', constants.CODETYPE_CHANNEL_TP);
export const getPressCate1 = createReadOnlySaga(act.GET_PRESS_CATE1, 'pressCate1Rows', constants.CODETYPE_PRESS_CATE1);
export const getHttpMethod = createReadOnlySaga(act.GET_HTTP_METHOD, 'httpMethodRows', constants.CODETYPE_HTTP_METHOD);
export const getApiType = createReadOnlySaga(act.GET_API_TYPE, 'apiTypeRows', constants.CODETYPE_API_TYPE);
export const getTourAge = createReadOnlySaga(act.GET_TOUR_AGE, 'tourAgeRows', constants.CODETYPE_TOUR_AGE);

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
    yield takeLatest(act.GET_CODE_MGT_GRP_DUPLICATE_CHECK, getCodeMgtGrpDuplicateCheck);
    yield takeLatest(act.GET_CODE_MGT_DUPLICATE_CHECK, getCodeMgtDuplicateCheck);

    yield takeLatest(act.GET_TP_SIZE, getTpSize);
    yield takeLatest(act.GET_TP_ZONE, getTpZone);
    yield takeLatest(act.GET_LANG, getLang);
    yield takeLatest(act.GET_SERVICE_TYPE, getServiceType);
    yield takeLatest(act.GET_PAGE_TYPE, getPageType);
    yield takeLatest(act.GET_API, getApi);
    yield takeLatest(act.GET_ART_GROUP, getArtGroup);
    yield takeLatest(act.GET_BULK_CHAR, getBulkChar);
    yield takeLatest(act.GET_DS_FONT_IMGD, getDsFontImgD);
    yield takeLatest(act.GET_DS_FONT_IMGW, getDsFontImgW);
    yield takeLatest(act.GET_DS_FONT_VODD, getDsFontVodD);
    yield takeLatest(act.GET_DS_TITLE_LOC, getDsTitleLoc);
    yield takeLatest(act.GET_DS_PRE, getDsPre);
    yield takeLatest(act.GET_DS_PRE_LOC, getDsPreLoc);
    yield takeLatest(act.GET_DS_ICON, getDsIcon);
    yield takeLatest(act.GET_ARTICLE_TYPE, getArticleType);
    yield takeLatest(act.GET_PT, getPt);
    yield takeLatest(act.GET_CHANNEL_TP, getChannelTp);
    yield takeLatest(act.GET_PRESS_CATE1, getPressCate1);
    yield takeLatest(act.GET_HTTP_METHOD, getHttpMethod);
    yield takeLatest(act.GET_API_TYPE, getApiType);
    yield takeLatest(act.GET_TOUR_AGE, getTourAge);

    yield takeLatest(act.GET_SPECIAL_CHAR_CODE, getSpecialCharCode);
    yield takeLatest(act.SAVE_SPECIAL_CHAR_CODE, putSpecialCharCode);
}
