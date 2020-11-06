import { call, put, takeLatest, select } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading';

import * as act from './containerAction';
import * as api from './containerApi';

/**
 * 컨테이너 목록 조회
 */
const getContainerList = callApiAfterActions(act.GET_CONTAINER_LIST, api.getContainerList, (store) => store.container);

/**
 * 컨테이너 lookup 목록 조회
 */
const getContainerLookupList = callApiAfterActions(act.GET_CONTAINER_LOOKUP_LIST, api.getContainerList, (store) => store.container.lookup);

/**
 * 컨테이너 조회
 */
const getContainer = createRequestSaga(act.GET_CONTAINER, api.getContainer);

/**
 * 컨테이너 (모달용) 조회
 */
const getContainerModal = createRequestSaga(act.GET_CONTAINER_MODAL, api.getContainer, true);

/**
 * 저장/수정
 * @param {array} param0.payload.actions 저장 전 액션리스트
 * @param {func} param0.payload.callback 콜백
 */
export function* saveContainer({ payload: { actions, callback } }) {
    let ACTION = act.SAVE_CONTAINER;
    let response,
        callbackData = {};

    yield put(startLoading(ACTION));
    try {
        // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        // 컨테이너 데이터와 컨테이너 바디
        const container = yield select((store) => store.container.container);
        const containerBody = yield select((store) => store.container.containerBody);

        // 등록/수정 분기
        if (container.containerSeq) {
            response = yield call(api.putContainer, { container: { ...container, containerBody } });
        } else {
            response = yield call(api.postContainer, { container: { ...container, containerBody } });
        }

        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: act.GET_CONTAINER_SUCCESS,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_CONTAINER_LIST });
        } else {
            yield put({
                type: act.GET_CONTAINER_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.GET_CONTAINER_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string|number} param0.payload.containerSeq 컴포넌트ID (필수)
 * @param {func} param0.payload.callback 콜백
 */
export function* deleteContainer({ payload: { containerSeq, callback } }) {
    const ACTION = act.DELETE_CONTAINER;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteContainer, { containerSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({
                type: act.GET_CONTAINER_SUCCESS,
                payload: callbackData,
            });

            // 목록 다시 검색
            yield put({ type: act.GET_CONTAINER_LIST });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData, containerSeq);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 관련 아이템 체크
 */
const hasRelationList = createRequestSaga(act.HAS_RELATION_LIST, api.hasRelationList, true);

export default function* saga() {
    yield takeLatest(act.GET_CONTAINER_LIST, getContainerList);
    yield takeLatest(act.GET_CONTAINER, getContainer);
    yield takeLatest(act.SAVE_CONTAINER, saveContainer);
    yield takeLatest(act.DELETE_CONTAINER, deleteContainer);
    yield takeLatest(act.HAS_RELATION_LIST, hasRelationList);
    yield takeLatest(act.GET_CONTAINER_MODAL, getContainerModal);
    yield takeLatest(act.GET_CONTAINER_LOOKUP_LIST, getContainerLookupList);
}
