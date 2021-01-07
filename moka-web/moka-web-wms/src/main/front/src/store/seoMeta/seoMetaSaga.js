import { call, put, takeLatest } from 'redux-saga/effects';
import { finishLoading, startLoading } from '@store/loading';
import { errorResponse } from '@store/commons/saga';
import * as api from '@store/seoMeta/seoMetaApi';
import * as action from '@store/seoMeta/seoMetaAction';

function toSeoMetaListData(list) {
    console.log('list', list);
    const convert = list.map((data) => ({
        id: data.totalId,
        title: data.artTitle,
        serviceDt: data.serviceDt,
    }));
    console.log('convert', convert);

    return {};
}

function* getSeoMetaList({ type, payload }) {
    yield put(startLoading(type));
    try {
        const response = yield call(api.getSeoMetaList, { search: payload });

        if (response.data.header.success) {
            const list = toSeoMetaListData(response.data.body.list);

            yield put({ type: `${type}_SUCCESS`, payload: { ...response.data, body: { ...response.data.body, list } } });
        } else {
            yield put({ type: `${type}_FAILURE`, payload: response.data });
        }
    } catch (e) {
        yield put({ type: `${type}_FAILURE`, payload: errorResponse(e) });
        console.log(e);
    }
    yield put(finishLoading(type));
}

export default function* seoMetaSaga() {
    yield takeLatest(action.GET_SEO_META_LIST, getSeoMetaList);
}
