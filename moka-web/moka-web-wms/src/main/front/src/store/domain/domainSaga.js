import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as domainAPI from './domainApi';
import * as act from './domainAction';

/**
 * 목록
 */
const getDomainList = callApiAfterActions(act.GET_DOMAIN_LIST, domainAPI.getDomainList, (state) => state.domain);

/**
 * 데이터 조회
 */
const getDomain = createRequestSaga(act.GET_DOMAIN, domainAPI.getDomain);

/**
 * 도메인아이디 중복 체크
 * @param {string} param0.payload.domainId 도메인아이디
 * @param {func} param0.payload.callback 콜백
 */
function* duplicateCheck({ payload: { domainId, callback } }) {
    const ACTION = act.DUPLICATE_CHECK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(domainAPI.duplicateCheck, domainId);
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
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveDomain({ payload: { type, actions, callback } }) {
    const ACTION = act.SAVE_DOMAIN;
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

        // 도메인 데이터
        const domain = yield select((store) => store.domain.domain);
        const response = type === 'insert' ? yield call(domainAPI.postDomain, { domain }) : yield call(domainAPI.putDomain, { domain });
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_DOMAIN_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_DOMAIN_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getDomains(domain.domainId));
        } else {
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: response.data.body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_DOMAIN_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 관련데이터 확인
 * @param {string} param0.payload.domainId 도메인아이디
 * @param {func} param0.payload.callback 콜백
 */
function* hasRelationList({ payload: { domainId, callback } }) {
    const ACTION = act.HAS_RELATION_LIST;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(domainAPI.hasRelationList, { domainId });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData, domainId);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string} param0.payload.domainId 도메인아이디
 * @param {func} param0.payload.callback 콜백
 */
function* deleteDomain({ payload: { domainId, callback } }) {
    const ACTION = act.DELETE_DOMAIN;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(domainAPI.deleteDomain, { domainId });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({ type: act.DELETE_DOMAIN_SUCCESS });

            // 목록 다시 검색
            yield put({ type: act.GET_DOMAIN_LIST });

            // auth 도메인 목록 다시 조회
            //yield put(getDomainList());
        } else {
            yield put({
                type: act.DELETE_DOMAIN_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.DELETE_DOMAIN_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* domainSaga() {
    yield takeLatest(act.GET_DOMAIN_LIST, getDomainList);
    yield takeLatest(act.GET_DOMAIN, getDomain);
    yield takeLatest(act.DUPLICATE_CHECK, duplicateCheck);
    yield takeLatest(act.SAVE_DOMAIN, saveDomain);
    yield takeLatest(act.DELETE_DOMAIN, deleteDomain);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
}
