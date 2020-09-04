import { call, put } from 'redux-saga/effects';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import { startLoading, finishLoading } from '../loadingStore';

export const createRequestActionTypes = (actionType) => {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;
    return [actionType, SUCCESS, FAILURE];
};

/**
 * API 호출
 * @param {string} actionType 액션명
 * @param {function} api API 함수
 */
export default function createRequestSaga(actionType, api) {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;

    return function* (action) {
        yield put(startLoading(actionType)); // 로딩 시작
        try {
            const response = yield call(api, action.payload);

            if (response.data.header.success) {
                yield put({
                    type: SUCCESS,
                    payload: response.data,
                    meta: response
                });
            } else {
                yield put({
                    type: FAILURE,
                    payload: response.data,
                    error: true
                });
                yield put(
                    enqueueSnackbar({
                        key: `requestFail${new Date().getTime() + Math.random()}`,
                        message: response.data.header.message,
                        options: {
                            variant: 'error',
                            persist: true
                        }
                    })
                );
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: e,
                error: true
            });
            yield put(
                enqueueSnackbar({
                    key: `requestFail${new Date().getTime() + Math.random()}`,
                    message: e.message,
                    options: {
                        variant: 'error',
                        persist: true
                    }
                })
            );
        }
        yield put(finishLoading(actionType)); // 로딩 끝
    };
}
