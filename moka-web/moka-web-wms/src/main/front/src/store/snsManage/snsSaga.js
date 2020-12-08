import * as api from '@store/snsManage/snsApi';
import * as action from '@store/snsManage/snsAction';
import { takeLatest, put, call, select } from 'redux-saga/effects';

import { finishLoading, startLoading } from '@store/loading';
import { errorResponse } from '@store/commons/saga';

function* getSnsMetaList({ type, payload }) {
    yield put(startLoading(type));
    console.log(type, payload);
    try {
        const response = yield call(api.getSNSMetaList, { search: payload });

        if (response.data.header.success) {
            yield put({ type: `${type}_SUCCESS`, payload: response.data });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
        console.log(response);
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
        console.log(e);
    }
    yield put(finishLoading(type));
}

export default function* snsSaga() {
    yield takeLatest(action.GET_SNS_META_LIST, getSnsMetaList);
}
