import { takeLatest, put, call, select } from 'redux-saga/effects';
import * as action from './pollAction';
import * as pollApi from './pollApi';
import * as codeMgtApi from '@store/codeMgt/codeMgtApi';
import { finishLoading, startLoading } from '@store/loading';
import produce from 'immer';

function toOptionCodes(list) {
    return list.map((data) => ({
        key: data.dtlCd,
        value: data.cdNm,
    }));
}

function* getPollCodes({ type, payload }) {
    try {
        const response = yield call(codeMgtApi.getUseCodeMgtList, payload);
        if (response.data.header.success) {
            const codes = toOptionCodes(response.data.body.list);
            yield put({ type: `${type}_SUCCESS`, payload: codes });
        }
    } catch (e) {}
}

function toKorFromCode(code, codes) {
    const codeItem = codes.filter((data) => data.key === code)[0];
    return codeItem ? codeItem.value : '';
}

function toPollList(list, codes) {
    return list.map((data) => {
        return {
            id: data.pollSeq,
            category: toKorFromCode(data.pollCategory, codes.category),
            group: toKorFromCode(data.pollGroup, codes.group),
            status: toKorFromCode(data.status, codes.status),
            title: data.title,
            regDt: data.regDt,
            modDt: data.modDt,
            startDt: data.startDt,
            endDt: data.endDt,
            regMember: data.regMember,
            modMember: data.modMember,
        };
    });
}

function* getPollList({ type, payload }) {
    yield put(startLoading(type));
    try {
        const response = yield call(pollApi.getPollList, { search: payload });
        console.log(response);
        if (response.data.header.success) {
            const codes = yield select((store) => store.poll.codes);
            const list = toPollList(response.data.body.list, codes);
            yield put({
                type: `${type}_SUCCESS`,
                payload: produce(response, (draft) => {
                    draft.data.body.list = list;
                }),
            });
        } else {
        }
    } catch (e) {
        console.log(e);
    }

    yield put(finishLoading(type));
}

export default function* pollSaga() {
    yield takeLatest(action.GET_POLL_CATEGORY_CODES, getPollCodes);
    yield takeLatest(action.GET_POLL_GROUP_CODES, getPollCodes);
    yield takeLatest(action.GET_POLL_LIST, getPollList);
}
