import { call, put, takeLatest } from 'redux-saga/effects';
import { finishLoading, startLoading } from '@store/loading';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import * as api from '@store/issue/issueApi';
import * as action from '@store/issue/issueAction';
import { errorResponse } from '@store/commons/saga';

const toPackageListData = (response) => {
    return response;
};

function* getPackageList({ type, payload }) {
    yield put(startLoading(type));

    try {
        const startDt = payload.startDt && payload.startDt.isValid() ? moment(payload.startDt).format(DB_DATEFORMAT) : null;
        const endDt = payload.endDt && payload.endDt.isValid() ? moment(payload.endDt).format(DB_DATEFORMAT) : null;
        const search = { ...payload, startDt, endDt };

        const response = yield call(api.getPackageList, { search });
        if (response.data.header.success) {
            const list = toPackageListData(response.data.body.list);

            yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
    }
    yield put(finishLoading(type));
}

export default function* snsSaga() {
    /************* 메타 **********************/
    yield takeLatest(action.GET_PACKAGE_LIST, getPackageList);
}
