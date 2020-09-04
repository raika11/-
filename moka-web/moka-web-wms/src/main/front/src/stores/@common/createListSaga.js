import { call, put, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';

/**
 * createListSaga
 * @param {string} actionType 액션명
 * @param {function} api API 함수
 * @param {string} searchType 추가적인 search option을 변경하는 액션명
 * @param {function} targetStateSelector 특정 state조회하는 함수
 */
export default function createListSaga(actionType, api, searchType, targetStateSelector) {
    const SUCCESS = `${actionType}_SUCCESS`;
    const FAILURE = `${actionType}_FAILURE`;

    return function* (action) {
        yield put(startLoading(actionType)); // 로딩 시작
        try {
            // direct로 검색할 조건이 있을 경우만, search 조건을 변경한다.
            if (action.payload) {
                yield put({ type: searchType, payload: action.payload });
            }
            const activeSearch = yield select(targetStateSelector);
            const response = yield call(api, activeSearch);

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
            }
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: e,
                error: true
            });
        }
        yield put(finishLoading(actionType)); // 로딩 끝
    };
}
