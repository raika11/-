import { call, put, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { NETWORK_ERROR_MESSAGE } from '@/constants';

/**
 * 통신에러 response 처리
 * @param {any} body 본문
 */
export const errorResponse = (body) => ({
    header: {
        success: false,
        message: NETWORK_ERROR_MESSAGE,
    },
    body,
});

/**
 * 성공/삭제 액션명 생성
 * @param {string} actionType 액션명
 */
export const createRequestActionTypes = (actionType) => {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;
    return [actionType, SUCCESS, FAILURE];
};

/**
 * API 호출
 * @param {string} actionType 액션명
 * @param {func} api API 함수
 */
export function createRequestSaga(actionType, api) {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;

    return function* (action) {
        yield put(startLoading(actionType));

        try {
            const response = yield call(api, action.payload);

            if (response.data.header.success) {
                yield put({
                    type: SUCCESS,
                    payload: response.data,
                });
            } else {
                yield put({
                    type: FAILURE,
                    payload: response.data,
                });
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: errorResponse(e),
            });
        }

        yield put(finishLoading(actionType)); // 로딩 끝
    };
}

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
        yield put(startLoading(actionType));

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
                });
            } else {
                yield put({
                    type: FAILURE,
                    payload: response.data,
                });
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: errorResponse(e),
            });
        }
        yield put(finishLoading(actionType));
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
                });
            } else {
                yield put({
                    type: FAILURE,
                    payload: response.data,
                });
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: errorResponse(e),
            });
        }

        yield put(finishLoading(actionType));
    };
};
