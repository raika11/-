import { call, put, select } from 'redux-saga/effects';
import { enqueueToast } from '@store/notification/toastStore';
import { startLoading, finishLoading } from '@store/loading/loadingAction';

/**
 * payload로 넘어온 액션들을 처리하고 api를 호출한다
 * @param {string} actionType 액션타입
 * @param {function} api api
 * @param {function} targetStateSelector state 셀렉터
 */
export const callApiAfterActions = (actionType, api, targetStateSelector) => {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;

    return function* ({ payload: actions }) {
        //yield put(startLoading(actionType));
        try {
            // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
            if (actions && actions.length > 0) {
                for (let i = 0; i < actions.length; i++) {
                    const act = actions[i];
                    if (act) {
                        yield put({
                            type: act.type,
                            payload: act.payload,
                        });
                    }
                }
            }
            // 검색 조건
            const searchOption = yield select(targetStateSelector);
            const response = yield call(api, searchOption);

            if (response.data.header.success) {
                yield put({
                    type: SUCCESS,
                    payload: response.data,
                    meta: response,
                });
            } else {
                yield put({
                    type: FAILURE,
                    payload: response.data,
                    error: true,
                });
                yield put(
                    enqueueToast({
                        key: `fail${new Date().getTime() + Math.random()}`,
                        message: response.data.header.message,
                        options: {
                            variant: 'error',
                            persist: true,
                        },
                    }),
                );
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: e,
                error: true,
            });
            yield put(
                enqueueToast({
                    key: `fail${new Date().getTime() + Math.random()}`,
                    message: e.message,
                    options: {
                        variant: 'error',
                        persist: true,
                    },
                }),
            );
            console.log(e.message);
        }
        //yield put(finishLoading(actionType));
    };
};

/**
 * api를 호출할 때 넘겨받은 param을 넘겨 호출한다
 * @param {string} actionType 액션타입
 * @param {function} api api
 * @param {*} param 파라미터
 */
export const callApiWithParam = (actionType, api, param) => {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;

    return function* () {
        yield put(startLoading(actionType));
        try {
            const response = yield call(api, param);

            if (response.data.header.success) {
                yield put({
                    type: SUCCESS,
                    payload: response.data,
                    meta: response,
                });
            } else {
                yield put({
                    type: FAILURE,
                    payload: response.data,
                    error: true,
                });
                yield put(
                    enqueueToast({
                        key: `fail${new Date().getTime() + Math.random()}`,
                        message: response.data.header.message,
                        options: {
                            variant: 'error',
                            persist: true,
                        },
                    }),
                );
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: e,
                error: true,
            });
            yield put(
                enqueueToast({
                    key: `fail${new Date().getTime() + Math.random()}`,
                    message: e.message,
                    options: {
                        variant: 'error',
                        persist: true,
                    },
                }),
            );
        }
        yield put(finishLoading(actionType));
    };
};
