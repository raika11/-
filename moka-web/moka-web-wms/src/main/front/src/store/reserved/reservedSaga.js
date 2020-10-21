import { call, put, select, takeLatest } from 'redux-saga/effects';
import { callApiAfterActions, createRequestSaga } from '@store/commons/saga';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import * as api from './reservedApi';
import * as act from './reservedAction';

/**
 * 예약어 목록 조회
 */
export const getReservedList = callApiAfterActions(act.GET_RESERVED_LIST, api.getReservedList, (store) => store.reserved);

/**
 * 예약어 등록
 */
export function* putReserved({ payload: { actions, callback } }) {
    const ACTION = act.PUT_RESERVED;
    let response, callbackData;

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
        const reservedData = yield select((store) => store.reserved.reserved);

        // 등록/수정
        if (reservedData.reservedSeq) {
            response = yield call(api.putReserved, { reserved: reservedData });
        } else {
            response = yield call(api.postReserved, { reserved: reservedData });
        }

        if (response.data.header.success) {
            callbackData = response.data;

            // 성공 액션
            yield put({
                type: act.GET_RESERVED_SUCCESS,
                payload: response.data,
            });

            // 목록
            yield put({ type: act.GET_RESERVED_LIST });
        } else {
            callbackData = response.data;

            // 실패 액션 실행
            yield put({
                type: act.GET_RESERVED_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = e;

        // 실패 액션 실행
        yield put({
            type: act.GET_RESERVED_FAILURE,
            payload: { header: { success: false }, body: e },
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

/**
 * 예약어 삭제
 */
export function* deleteReserved({ payload: { reservedSet, callback } }) {
    const ACTION = act.DELETE_RESERVED;
    let callbackData;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteReserved, reservedSet.seq);

        if (response.data.header.success) {
            yield put({
                type: act.DELETE_RESERVED_SUCCESS,
                payload: response.data,
            });

            // 목록
            yield put({
                type: act.GET_RESERVED_LIST,
                payload: { domainId: reservedSet.domainId },
            });
        } else {
            yield put({
                type: act.DELETE_RESERVED_FAILURE,
                payload: response.data,
            });

            // 목록 다시 검색
            yield put({
                type: act.GET_RESERVED_LIST,
                payload: { domainId: reservedSet.domainId },
            });
        }
    } catch (e) {
        yield put({
            type: act.DELETE_RESERVED_FAILURE,
            payload: e,
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
export const getReserved = createRequestSaga(act.getReserved, api.getReserved);

/** saga */
export default function* saga() {
    yield takeLatest(act.GET_RESERVED_LIST, getReservedList);
    yield takeLatest(act.GET_RESERVED, getReserved);
    yield takeLatest(act.PUT_RESERVED, putReserved);
    yield takeLatest(act.DELETE_RESERVED, deleteReserved);
}
