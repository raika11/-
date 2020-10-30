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
 * @param {bool} simpleCall SUCCESS/FAILURE 액션 유무
 */
export function createRequestSaga(actionType, api, simpleCall = false) {
    return function* (action) {
        const payload = action.payload;
        const { callback } = payload;
        let callbackData;

        yield put(startLoading(actionType));

        try {
            const response = yield call(api, action.payload);
            callbackData = { ...response.data, payload };

            if (!simpleCall) {
                if (response.data.header.success) {
                    yield put({
                        type: `${actionType}_SUCCESS`,
                        payload: response.data,
                    });
                } else {
                    yield put({
                        type: `${actionType}_FAILURE`,
                        payload: response.data,
                    });
                }
            }
        } catch (e) {
            callbackData = errorResponse(e);

            if (!simpleCall) {
                yield put({
                    type: `${actionType}_FAILURE`,
                    payload: errorResponse(e),
                });
            }
        }

        if (typeof callback === 'function') {
            yield call(callback, callbackData);
        }

        yield put(finishLoading(actionType));
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
