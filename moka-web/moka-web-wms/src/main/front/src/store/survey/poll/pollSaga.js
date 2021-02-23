import { takeLatest, put, call, select } from 'redux-saga/effects';
import * as action from './pollAction';
import * as pollApi from './pollApi';
import * as codeMgtApi from '@store/codeMgt/codeMgtApi';
import { finishLoading, startLoading } from '@store/loading';
import produce from 'immer';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import moment from 'moment';
import { BASIC_DATEFORMAT, DB_DATEFORMAT } from '@/constants';
import commonUtil from '@utils/commonUtil';

function toOptionCodes(list) {
    return list.map((data) => ({
        key: data.dtlCd,
        value: data.cdNm,
    }));
}

function* getPollCodes({ type, payload: grpCd }) {
    try {
        const response = yield call(codeMgtApi.getUseDtlList, { grpCd });
        if (response.data.header.success) {
            const codes = toOptionCodes(response.data.body.list);
            yield put({ type: `${type}_SUCCESS`, payload: codes });
        }
    } catch (e) {}
}

function toPollListData(list, codes) {
    return list.map((data) => {
        const startDt = data.startDt && moment(data.startDt).format(BASIC_DATEFORMAT);
        const endDt = data.endDt && moment(data.endDt).format(BASIC_DATEFORMAT);
        const regDt = data.regDt && moment(data.regDt).format(BASIC_DATEFORMAT);
        const modDt = data.modDt && moment(data.modDt).format(BASIC_DATEFORMAT);
        return {
            id: data.pollSeq,
            category: commonUtil.toKorFromCode(data.pollCategory, codes.pollCategory),
            group: commonUtil.toKorFromCode(data.pollGroup, codes.pollGroup),
            status: commonUtil.toKorFromCode(data.status, codes.status),
            title: unescapeHtmlArticle(data.title),
            regDt,
            modDt,
            startDt,
            endDt,
            regMember: data.regMember,
            modMember: data.modMember,
            isDelete: data.voteCnt === 0,
        };
    });
}

function* getPollList({ type, payload }) {
    yield put(startLoading(type));
    try {
        let search = payload.search;
        if (commonUtil.isEmpty(search.status) || search.status === '') {
            search = produce(search, (draft) => {
                draft['status'] = ['S', 'T'];
            });
        }
        const response = yield call(pollApi.getPollList, { search });

        if (response.data.header.success) {
            const codes = yield select((store) => store.poll.codes);
            const list = toPollListData(response.data.body.list, codes);
            yield put({
                type: `${type}_SUCCESS`,
                payload: produce(response, (draft) => {
                    draft.data.body.list = list;
                }),
            });
        } else {
        }

        if (payload.callback instanceof Function) {
            payload.callback(response.data);
        }
    } catch (e) {
        console.log(e);
    }

    yield put(finishLoading(type));
}

function toPollData(poll) {
    return {
        ...poll,
        title: unescapeHtmlArticle(poll.title),
        pollItems: poll.pollItems.sort(function (a, b) {
            if (a.ordNo > b.ordNo) {
                return 1;
            }
            if (a.ordNo < b.ordNo) {
                return -1;
            }
            return 0;
        }),
    };
}

function* getPoll({ type, payload }) {
    yield put(startLoading(type));
    try {
        const response = yield call(pollApi.getPoll, payload.pollSeq);

        if (response.data.header.success) {
            const poll = toPollData(response.data.body);

            yield put({
                type: `${type}_SUCCESS`,
                payload: poll,
            });
        } else {
        }
        if (payload.callback instanceof Function) {
            payload.callback({ ...response.data, body: toPollData(response.data.body) });
        }
    } catch (e) {
        console.log(e);
    }
    yield put(finishLoading(type));
}

function* savePoll({ type, payload }) {
    yield put(startLoading(type));

    const formData = pollObjectToFormData(payload.data);

    try {
        const response = yield call(pollApi.postPoll, formData);

        if (payload.callback instanceof Function) {
            payload.callback(response.data);
        }
    } catch (e) {
        console.log(e);
    }

    yield put(finishLoading(type));
}

function* updatePoll({ type, payload }) {
    yield put(startLoading(type));
    console.log(payload);
    const pollSeq = payload.data.pollSeq;
    const formData = pollObjectToFormData(payload.data);

    try {
        const response = yield call(pollApi.putPoll, pollSeq, formData);
        if (payload.callback instanceof Function) {
            payload.callback(response.data);
        }
    } catch (e) {
        console.log(e);
    }

    yield put(finishLoading(type));
}

function pollObjectToFormData(poll) {
    const pollForm = new FormData();
    Object.keys(poll).forEach((key) => {
        let value = poll[key];
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((data, index) => {
                    Object.keys(data).forEach((itemKey) => {
                        pollForm.append(`${key}[${index}].${itemKey}`, data[itemKey]);
                    });
                });
            } else {
                pollForm.append(key, value);
            }
        }
    });

    return pollForm;
}

function* deletePoll({ type, payload }) {
    try {
        const response = yield call(pollApi.deletePoll, payload.pollSeq);
        if (payload.callback instanceof Function) {
            payload.callback(response.data);
        }
    } catch (e) {
        console.log(e);
    }
}

export default function* pollSaga() {
    yield takeLatest(action.GET_POLL_CATEGORY_CODES, getPollCodes);
    yield takeLatest(action.GET_POLL_GROUP_CODES, getPollCodes);
    yield takeLatest(action.GET_POLL_LIST, getPollList);
    yield takeLatest(action.GET_POLL, getPoll);
    yield takeLatest(action.SAVE_POLL, savePoll);
    yield takeLatest(action.UPDATE_POLL, updatePoll);
    yield takeLatest(action.DELETE_POLL, deletePoll);
    yield takeLatest(action.GET_RELATION_POLL_LIST, getPollList);
    yield takeLatest(action.GET_PREVIEW_POLL, getPoll);
}
