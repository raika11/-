import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import { ENQUEUE_SNACKBAR } from '~/stores/notification/snackbarStore';

export default function createModifySaga({ successMessage, failMessage }, ...actionCreators) {
    return function* (action) {
        let success = false;
        for (let i = 0; i < actionCreators.length; i += 2) {
            const SUCCESS = `${actionCreators[i]}_SUCCESS`;
            const FAILURE = `${actionCreators[i]}_FAILURE`;
            yield put(startLoading(actionCreators[i])); // 로딩 시작
            try {
                const response = yield call(actionCreators[i + 1], action.payload);

                if (response.data.header.success) {
                    yield put({
                        type: SUCCESS,
                        payload: response.data,
                        meta: response
                    });
                    if (i === 0) {
                        success = true; // 첫번째 액션에 대해서만 성공여부를 검사한다.
                    }
                } else {
                    yield put({
                        type: FAILURE,
                        payload: response.data,
                        error: true
                    });
                    yield put(finishLoading(actionCreators[i])); // 로딩 끝
                    break; // 실패시 이후 액션은 처리하지 않는다.
                }
            } catch (e) {
                yield put({
                    type: FAILURE,
                    payload: e,
                    error: true
                });
                yield put(finishLoading(actionCreators[i])); // 로딩 끝
                break; // 실패시 이후 액션은 처리하지 않는다.
            }
            yield put(finishLoading(actionCreators[i])); // 로딩 끝
        }

        // 메세지박스 노출
        if (success) {
            yield put({
                type: ENQUEUE_SNACKBAR,
                payload: {
                    key: new Date().getTime() + Math.random(),
                    message: successMessage,
                    options: {
                        severity: 'success'
                    }
                }
            });
        } else {
            yield put({
                type: ENQUEUE_SNACKBAR,
                payload: {
                    key: new Date().getTime() + Math.random(),
                    message: failMessage,
                    options: {
                        severity: 'error'
                    }
                }
            });
        }
    };
}
