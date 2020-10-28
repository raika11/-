import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as reservedAPI from './reservedApi';
import * as reservedAction from './reservedAction';

/**
 * 예약어 목록 조회
 */
export const getReservedList = callApiAfterActions(reservedAction.GET_RESERVED_LIST, reservedAPI.getReservedList, (store) => store.reserved);

/**
 * 예약어 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
export function* saveReserved({ payload: { type, actions, callback } }) {
    const ACTION = reservedAction.SAVE_RESERVED;
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

        // 예약어 데이터
        const reserved = yield select((store) => store.reserved.reserved);
        const response = type === 'insert' ? yield call(reservedAPI.postReserved, { reserved }) : yield call(reservedAPI.putReserved, { reserved });
        callbackData = response.data;

        if (response.data.header.success) {
            // 성공 액션
            yield put({
                type: reservedAction.GET_RESERVED_SUCCESS,
                payload: response.data,
            });

            // 목록 검색
            yield put({ type: reservedAction.GET_RESERVED_LIST });
        } else {
            // 실패 액션 실행
            yield put({
                type: reservedAction.GET_RESERVED_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        // 실패 액션 실행
        yield put({
            type: reservedAction.GET_RESERVED_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 예약어 삭제
 * @param {} param0.payload.reservedSet
 * @param {func} param0.payload.callback 콜백
 */
export function* deleteReserved({ payload: { reservedSet, callback } }) {
    const ACTION = reservedAction.DELETE_RESERVED;
    let callbackData = {};

    yield put(startLoading(ACTION));
    try {
        const response = yield call(reservedAPI.deleteReserved, reservedSet.reservedSeq);
        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: reservedAction.DELETE_RESERVED_SUCCESS,
                payload: response.data,
            });

            // 목록 검색
            yield put({
                type: reservedAction.GET_RESERVED_LIST,
                payload: { domainId: reservedSet.domainId },
            });
        } else {
            yield put({
                type: reservedAction.DELETE_RESERVED_FAILURE,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({
                type: reservedAction.GET_RESERVED_LIST,
                payload: { domainId: reservedSet.domainId },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: reservedAction.DELETE_RESERVED_FAILURE,
            payload: callbackData,
        });
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 예약어 정보 조회
 */
export const getReserved = createRequestSaga(reservedAction.GET_RESERVED, reservedAPI.getReserved);

/** saga */
export default function* saga() {
    yield takeLatest(reservedAction.GET_RESERVED_LIST, getReservedList);
    yield takeLatest(reservedAction.GET_RESERVED, getReserved);
    yield takeLatest(reservedAction.SAVE_RESERVED, saveReserved);
    yield takeLatest(reservedAction.DELETE_RESERVED, deleteReserved);
}
