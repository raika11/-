import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createRequestSaga, errorResponse } from '../commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as constants from '@/constants';
import * as api from './codeMgtApi';
import * as act from './codeMgtAction';

/**
 * 그룹 목록 조회
 */
const getGrpList = createRequestSaga(act.GET_GRP_LIST, api.getGrpList);

/**
 * 상세코드 목록 조회
 */
const getDtlList = createRequestSaga(act.GET_DTL_LIST, api.getDtlList);

/**
 * 그룹 조회
 */
const getGrp = createRequestSaga(act.GET_GRP, api.getGrp);

/**
 * 그룹 조회 (모달)
 */
const getGrpModal = createRequestSaga(act.GET_GRP_MODAL, api.getGrp, true);

/**
 * 상세코드 조회 (모달)
 */
const getDtlModal = createRequestSaga(act.GET_DTL_MODAL, api.getDtl, true);

/**
 * 그룹 저장
 */
function* saveGrp({ payload: { grp, callback } }) {
    const ACTION = act.SAVE_GRP;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(grp.seqNo ? api.putGrp : api.postGrp, { grp });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select(({ codeMgt }) => codeMgt.grp.search);
            yield put({
                type: act.GET_GRP_LIST,
                payload: { search },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 그룹 삭제
 */
function* deleteGrp({ payload: { seqNo, callback } }) {
    const ACTION = act.DELETE_GRP;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteGrp, { seqNo });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            // 목록 다시 검색
            const search = yield select(({ codeMgt }) => codeMgt.grp.search);
            yield put({
                type: act.GET_GRP_LIST,
                payload: { search },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 상세코드 저장
 */
function* saveDtl({ payload: { dtl, callback } }) {
    const ACTION = act.SAVE_DTL;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(dtl.seqNo ? api.putDtl : api.postDtl, { dtl });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select(({ codeMgt }) => codeMgt.dtl.search);
            yield put({ type: act.GET_DTL_LIST, payload: { search } });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 상세코드 삭제
 */
function* deleteDtl({ payload: { seqNo, callback } }) {
    const ACTION = act.DELETE_DTL;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteDtl, { seqNo });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            const search = yield select(({ codeMgt }) => codeMgt.dtl.search);
            yield put({ type: act.GET_DTL_LIST, payload: { search } });
        }
    } catch (e) {
        callbackData = errorResponse(e);
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
            const response = yield call(api.getUseDtlList, { grpCd });
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
 * 그룹 중복체크
 */
function* existsGrp({ payload: { grpCd, callback } }) {
    const ACTION = act.EXISTS_GRP;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.existsGrp, { grpCd });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 상세코드 중복체크
 */
function* existsDtl({ payload: { grpCd, dtlCd, callback } }) {
    const ACTION = act.EXISTS_DTL;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.existsDtl, { grpCd, dtlCd });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
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

function* putSpecialCharCode({ payload: { grpCd, dtlCd, cdNm, callback } }) {
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

const getTpSize = createReadOnlySaga(act.GET_TP_SIZE, 'tpSizeRows', constants.CODETYPE_TP_SIZE);
const getTpZone = createReadOnlySaga(act.GET_TP_ZONE, 'tpZoneRows', constants.CODETYPE_TP_ZONE);
const getLang = createReadOnlySaga(act.GET_LANG, 'langRows', constants.CODETYPE_LANG);
const getServiceType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'serviceTypeRows', constants.CODETYPE_SERVICE_TYPE);
const getPageType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'pageTypeRows', constants.CODETYPE_PAGE_TYPE);
const getApi = createReadOnlySaga(act.GET_API, 'apiRows', constants.CODETYPE_API);
const getArtGroup = createReadOnlySaga(act.GET_ART_GROUP, 'artGroupRows', constants.CODETYPE_ART_GROUP);
const getBulkChar = createReadOnlySaga(act.GET_BULK_CHAR, 'bulkCharRows', constants.CODETYPE_SPECIALCHAR);
const getDsFontImgD = createReadOnlySaga(act.GET_DS_FONT_IMGD, 'dsFontImgDRows', constants.CODETYPE_DS_FONT_IMGD);
const getDsFontImgW = createReadOnlySaga(act.GET_DS_FONT_IMGW, 'dsFontImgWRows', constants.CODETYPE_DS_FONT_IMGW);
const getDsFontVodD = createReadOnlySaga(act.GET_DS_FONT_VODD, 'dsFontVodDRows', constants.CODETYPE_DS_FONT_VODD);
const getDsTitleLoc = createReadOnlySaga(act.GET_DS_TITLE_LOC, 'dsTitleLocRows', constants.CODETYPE_DS_TITLE_LOC);
const getDsPre = createReadOnlySaga(act.GET_DS_PRE, 'dsPreRows', constants.CODETYPE_DS_PRE);
const getDsPreLoc = createReadOnlySaga(act.GET_DS_PRE_LOC, 'dsPreLocRows', constants.CODETYPE_DS_PRE_LOC);
const getDsIcon = createReadOnlySaga(act.GET_DS_ICON, 'dsIconRows', constants.CODETYPE_DS_ICON);
const getArticleType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'articleTypeRows', constants.CODETYPE_ARTICLE_TYPE);
const getPt = createReadOnlySaga(act.GET_PT, 'ptRows', constants.CODETYPE_PT);
const getChannelTp = createReadOnlySaga(act.GET_CHANNEL_TP, 'channelTpRows', constants.CODETYPE_CHANNEL_TP);
const getPressCate1 = createReadOnlySaga(act.GET_PRESS_CATE1, 'pressCate1Rows', constants.CODETYPE_PRESS_CATE1);
const getPressCate61 = createReadOnlySaga(act.GET_PRESS_CATE61, 'pressCate61Rows', constants.CODETYPE_PRESS_CATE61);
const getHttpMethod = createReadOnlySaga(act.GET_HTTP_METHOD, 'httpMethodRows', constants.CODETYPE_HTTP_METHOD);
const getApiType = createReadOnlySaga(act.GET_API_TYPE, 'apiTypeRows', constants.CODETYPE_API_TYPE);
const getTourAge = createReadOnlySaga(act.GET_TOUR_AGE, 'tourAgeRows', constants.CODETYPE_TOUR_AGE);
const getBulkSite = createReadOnlySaga(act.GET_BULK_SITE, 'bulkSiteRows', constants.CODETYPE_BULK_SITE);
const getGenCate = createReadOnlySaga(act.GET_GEN_CATE, 'genCateRows', constants.CODETYPE_GEN_CATE);

/** saga */
export default function* codeMgt() {
    // 그룹 관련 사가
    yield takeLatest(act.GET_GRP_LIST, getGrpList);
    yield takeLatest(act.GET_GRP, getGrp);
    yield takeLatest(act.GET_GRP_MODAL, getGrpModal);
    yield takeLatest(act.SAVE_GRP, saveGrp);
    yield takeLatest(act.DELETE_GRP, deleteGrp);
    yield takeLatest(act.EXISTS_GRP, existsGrp);

    // 상세코드 관련 사가
    yield takeLatest(act.GET_DTL_LIST, getDtlList);
    yield takeLatest(act.GET_DTL_MODAL, getDtlModal);
    yield takeLatest(act.SAVE_DTL, saveDtl);
    yield takeLatest(act.DELETE_DTL, deleteDtl);
    yield takeLatest(act.EXISTS_DTL, existsDtl);

    // 조회 데이터
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
    yield takeLatest(act.GET_PRESS_CATE61, getPressCate61);
    yield takeLatest(act.GET_HTTP_METHOD, getHttpMethod);
    yield takeLatest(act.GET_API_TYPE, getApiType);
    yield takeLatest(act.GET_TOUR_AGE, getTourAge);
    yield takeLatest(act.GET_BULK_SITE, getBulkSite);
    yield takeLatest(act.GET_GEN_CATE, getGenCate);

    yield takeLatest(act.GET_SPECIAL_CHAR_CODE, getSpecialCharCode);
    yield takeLatest(act.SAVE_SPECIAL_CHAR_CODE, putSpecialCharCode);
}
