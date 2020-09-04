import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as reservedStore from './reservedStore';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import * as reservedAPI from '~/stores/api/reservedAPI';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import createRequestSaga from '~/stores/@common/createRequestSaga';

const defaultMessage = {
    key: `page${new Date().getTime() + Math.random()}`,
    message: '에러',
    options: {
        variant: 'error',
        persist: true
    }
};

/**
 * 예약어 목록 조회
 * @param {*} action
 */
function* getReservedListSaga(action) {
    try {
        const reservedData = yield call(reservedAPI.getReservedList, action.payload);
        yield put({ type: reservedStore.GET_RESERVED_LIST_SUCCESS, payload: reservedData });
    } catch (error) {
        yield put({ type: reservedStore.GET_RESERVED_LIST_FAILURE, error });
    }
}

const getReservedSaga = createRequestSaga(reservedStore.GET_RESERVED, reservedAPI.getReserved);

/**
 * 저장/수정
 * @param {object} param0 payload
 */
export function* putReservedListSaga({ payload: { actions, callback } }) {
    defaultMessage.key = `reserved${new Date().getTime() + Math.random()}`;
    let ACTION = reservedStore.PUT_RESERVED;

    yield put(startLoading(ACTION));
    try {
        // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload
                });
            }
        }
        const edit = yield select((state) => state.reservedStore.edit);

        let response;
        if (edit.reservedSeq) {
            response = yield call(reservedAPI.putReserved, { reserved: edit });
        } else {
            response = yield call(reservedAPI.postReserved, { reserved: edit });
        }

        if (response.data.header.success) {
            yield put({
                type: reservedStore.PUT_RESERVED_SUCCESS,
                payload: response.data
            });

            defaultMessage.message = edit.reservedSeq ? '수정하였습니다' : '등록하였습니다';
            defaultMessage.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({
                type: reservedStore.GET_RESERVED_LIST,
                payload: { domainId: edit.domainId }
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        } else {
            yield put({
                type: reservedStore.PUT_RESERVED_FAILURE,
                payload: response.data,
                error: true
            });

            defaultMessage.message = response.data.body.list[0].reason;

            // 목록 다시 검색
            yield put({
                type: reservedStore.GET_RESERVED_LIST,
                payload: { domainId: edit.domainId }
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        }
    } catch (e) {
        yield put({
            type: reservedStore.PUT_RESERVED_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));
    // 메세지박스 노출
    yield put(enqueueSnackbar(defaultMessage));
}

/**
 * 예약어 데이터 초기화
 */
export function* clearReversedSaga({ payload }) {
    yield put({
        type: reservedStore.CLEAR_RESERVED_INFO
    });
}

/**
 * 코드 삭제
 * @param {number} param0.payload.etccodeSeq 코드 아이디
 * @param {function} param0.payload.callback 콜백
 */
export function* deleteReserved({ payload: { reservedSet, callback } }) {
    let resultObj = {
        key: `reservedDel${new Date().getTime()}`,
        message: '삭제하지 못했습니다',
        options: { variant: 'error', persist: true }
    };

    const ACTION = reservedStore.DELETE_RESERVED;
    yield put(startLoading(ACTION));
    try {
        const response = yield call(reservedAPI.deleteReserved, reservedSet.seq);

        if (response.data.header.success) {
            yield put({
                type: reservedStore.DELETE_RESERVED_SUCCESS,
                payload: response.data
            });
            resultObj.message = '삭제하였습니다';
            resultObj.options = { variant: 'success', persist: false };

            // 목록 다시 검색
            yield put({
                type: reservedStore.GET_RESERVED_LIST,
                payload: { domainId: reservedSet.domainId }
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        } else {
            yield put({
                type: reservedStore.DELETE_RESERVED_FAILURE,
                payload: response.data
            });

            defaultMessage.message = response.data.body.list[0].reason;

            // 목록 다시 검색
            yield put({
                type: reservedStore.GET_RESERVED_LIST,
                payload: { domainId: reservedSet.domainId }
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        }
    } catch (e) {
        yield put({
            type: reservedStore.DELETE_RESERVED_FAILURE,
            payload: e
        });
    }
    yield put(finishLoading(ACTION));
    // 메세지박스 노출
    yield put(enqueueSnackbar(resultObj));
}

function* reservedSaga() {
    yield takeLatest(reservedStore.GET_RESERVED_LIST, getReservedListSaga);
    yield takeLatest(reservedStore.GET_RESERVED, getReservedSaga);
    yield takeLatest(reservedStore.PUT_RESERVED, putReservedListSaga);
    yield takeLatest(reservedStore.CLEAR_RESERVED, clearReversedSaga);
    yield takeLatest(reservedStore.DELETE_RESERVED, deleteReserved);
}

export default reservedSaga;
