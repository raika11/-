import { takeLatest, put, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import createRequestSaga from '../commons/createRequestSaga';
import { callApiAfterActions } from '../commons/createSaga.js';
import * as domainAPI from './domainApi';
import * as domainAction from './domainAction';
import { getDomainList } from '@store/auth';
import { enqueueToast } from '@store/notification/toastAction';

let message = {};

/**
 * 목록
 */
const getDomainsSaga = callApiAfterActions(domainAction.GET_DOMAINS, domainAPI.getDomains, (state) => state.domain);

/**
 * 조회
 */
const getDomainSaga = createRequestSaga(domainAction.GET_DOMAIN, domainAPI.getDomain);

/**
 * 도메인아이디 중복 체크
 * @param {string} param0.payload.domainId 도메인아이디
 * @param {func} param0.payload.unique 중복되지않을 때 콜백
 * @param {func} param0.payload.duplicate 중복될 때 콜백
 */
function* duplicateCheckSaga({ payload: { domainId, unique, duplicate } }) {
    const ACTION = domainAction.DUPLICATE_CHECK;
    //yield put(startLoading(ACTION));
    try {
        const response = yield call(domainAPI.duplicateCheck, domainId);
        if (response.data.header.success) {
            if (response.data.body) {
                if (typeof duplicate === 'function') duplicate(true);
            } else {
                if (typeof unique === 'function') unique(false);
            }
        }
        // eslint-disable-next-line no-empty
    } catch (e) {}
    //yield put(finishLoading(ACTION));
}

/**
 * 추가/수정
 * @param {object} param0.payload.domain 추가/수정할 도메인
 * @param {string} param0.payload.type insert|update
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
function* saveDomainSaga({ payload: { type, domain, success, fail, error } }) {
    const ACTION = domainAction.SAVE_DOMAIN;
    message.key = `domainSave${new Date().getTime() + Math.random()}`;
    message.message = '저장하지 못했습니다';
    message.options = { variant: 'error', persist: true };

    //yield put(startLoading(ACTION));
    try {
        const response = type === 'insert' ? yield call(domainAPI.postDomain, { domain }) : yield call(domainAPI.putDomain, { domain });

        if (response.data.header.success) {
            yield put({
                type: domainAction.GET_DOMAIN_SUCCESS,
                payload: response.data,
            });
            // 목록 다시 검색
            yield put({ type: domainAction.GET_DOMAINS });
            // auth 도메인 목록 다시 조회
            //yield put(getDomains(domain.domainId));
            message.message = type === 'insert' ? '등록하였습니다' : '수정하였습니다';
            message.options = { variant: 'success', persist: false };
            if (typeof success === 'function') success(response.data.body);
        } else {
            yield put({
                type: domainAction.GET_DOMAIN_FAILURE,
                payload: response.data,
            });
            message.message = response.data.header.message || message.message;
            if (typeof fail === 'function') fail(response.data);
        }
    } catch (e) {
        yield put({
            type: domainAction.GET_DOMAIN_FAILURE,
            payload: e,
        });
        if (typeof error === 'function') error(e);
    }
    // yield put(finishLoading(ACTION));
    yield put(enqueueToast(message));
}

/**
 * 관련데이터 확인
 * @param {string} param0.payload.domainId 도메인아이디
 * @param {func} param0.payload.exist 관련데이터 o 콜백
 * @param {func} param0.payload.notExist 관련데이터 x 콜백
 */
function* hasRelationsSaga({ payload: { domainId, exist, notExist } }) {
    const ACTION = domainAction.HAS_RELATIONS;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(domainAPI.hasRelations, { domainId });
        if (response.data.header.success) {
            if (response.data.body) {
                if (typeof exist === 'function') exist(true);
            } else {
                if (typeof notExist === 'function') notExist(false);
            }
        }
        // eslint-disable-next-line no-empty
    } catch (e) {}
    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string} param0.payload.domainId 도메인아이디
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
function* deleteDomainSaga({ payload: { domainId, success, fail, error } }) {
    const ACTION = domainAction.DELETE_DOMAIN;
    message.key = `domainDel${new Date().getTime() + Math.random()}`;
    message.message = '삭제하지 못했습니다';
    message.options = { variant: 'error', persist: true };

    //yield put(startLoading(ACTION));
    try {
        const response = yield call(domainAPI.deleteDomain, { domainId });

        if (response.data.header.success) {
            yield put({ type: domainAction.DELETE_DOMAIN_SUCCESS });
            // 목록 다시 검색
            yield put({ type: domainAction.GET_DOMAINS });
            // auth 도메인 목록 다시 조회
            yield put(getDomainList());
            message.message = '삭제하였습니다';
            message.options = { variant: 'success', persist: false };
            if (typeof success === 'function') success(response.data.body);
        } else {
            yield put({
                type: domainAction.DELETE_DOMAIN_FAILURE,
                payload: response.data,
            });
            message.message = response.data.header.message;
            if (typeof fail === 'function') fail(response.data);
        }
    } catch (e) {
        yield put({
            type: domainAction.DELETE_DOMAIN_FAILURE,
            payload: e,
        });
        if (typeof error === 'function') error(e);
    }
    //yield put(finishLoading(ACTION));
    yield put(enqueueToast(message));
}

function* clearDomainSaga({ payload }) {
    if (!payload || payload.search) {
        yield put({
            type: domainAction.CLEAR_SEARCH_OPTION,
        });
    }

    if (!payload || payload.list) {
        yield put({
            type: domainAction.CLEAR_DOMAIN_LIST,
        });
    }

    if (!payload || payload.detail) {
        yield put({
            type: domainAction.CLEAR_DOMAIN_DETAIL,
        });
    }
}

export default function* domainSaga() {
    yield takeLatest(domainAction.GET_DOMAINS, getDomainsSaga);
    yield takeLatest(domainAction.GET_DOMAIN, getDomainSaga);
    yield takeLatest(domainAction.DUPLICATE_CHECK, duplicateCheckSaga);
    yield takeLatest(domainAction.SAVE_DOMAIN, saveDomainSaga);
    yield takeLatest(domainAction.CLEAR_DOMAIN, clearDomainSaga);
    yield takeLatest(domainAction.DELETE_DOMAIN, deleteDomainSaga);
    yield takeLatest(domainAction.HAS_RELATIONS, hasRelationsSaga);
}
