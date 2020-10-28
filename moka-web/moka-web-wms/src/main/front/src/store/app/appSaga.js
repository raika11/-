import { call, put, takeLatest } from 'redux-saga/effects';
import * as act from './appAction';
import * as api from './appApi';

export function* appInit() {
    try {
        const response = yield call(api.appInit);

        if (response.data.header.success) {
            yield put({
                type: act.INIT_SUCCESS,
                payload: response.data,
            });
        } else {
            yield put({
                type: act.INIT_FAILURE,
            });
        }
    } catch (e) {
        yield put({
            type: act.INIT_FAILURE,
        });
    }
}

export default function* app() {
    yield takeLatest(act.INIT, appInit);
}
