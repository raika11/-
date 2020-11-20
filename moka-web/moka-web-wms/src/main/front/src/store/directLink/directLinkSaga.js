import { takeLatest, put, select, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';

import * as directApi from './directApi';
import * as act from './directLinkAction';

const getDirectLinkList = callApiAfterActions(act.GET_DIRECT_LINK_LIST, directApi.getDirectLinkList, (state) => state.directLink.search);

const getDirectLink = createRequestSaga(act.GET_DIRECT_LINK, directApi.getDirectLink);

function* saveDirectLink({ payload: { type, actions, callback } }) {
    const ACTION = act.SAVE_DIRECT_LINK;
    yield put(startLoading(ACTION));
    let callbackData = {};
    let response;

    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }
        const directLink = yield select((store) => store.directLink.directLink);
        if (type === 'insert') {
            if (directLink.imgUrl === '') directLink.imgUrl = 'http://pds.joins.com/news/search_direct_link/000.jpg'; // 임시로 이미지가 없을떄 서버에 디폴트 이미지 전송.
            response = yield call(directApi.postDirectLink, { directLink });
        } else if (type === 'update') {
            if (directLink.imgUrl === '') directLink.imgUrl = 'http://pds.joins.com/news/search_direct_link/000.jpg'; // 임시로 이미지가 없을떄 서버에 디폴트 이미지 전송.
            response = yield call(directApi.putDirectLink, { directLink });
        }
        callbackData = response.data;
        if (response.data.header.success) {
            // 성공시 리스트 가지고 오기.
            yield put({
                type: act.GET_DIRECT_LINK_SUCCESS,
                payload: response.data,
            });
            yield put({ type: act.GET_DIRECT_LINK_LIST });
        } else {
            // 실패 처리.
            const { body } = response.data.body;
            if (body && body.list && Array.isArray(body.list)) {
                yield put({
                    type: act.CHANGE_INVALID_LINK,
                    payload: response.data.body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
        yield put({
            type: act.GET_DIRECT_LINK_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

// 바로가기 삭제.
function* deleteDirectLink({ payload: { linkSeq, callback } }) {
    const ACTION = act.DELETE_DIRECT_LINK;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(directApi.deleteDirectLink, { linkSeq });
        callbackData = response.data;
        if (response.data.header.success && response.data.body) {
            yield put({ type: act.DELETE_DIRECT_LINK_SUCCESS });

            yield put({ type: act.GET_DIRECT_LINK_LIST });
        } else {
            yield put({
                type: act.DELETE_DIRECT_LINK_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.DELETE_DIRECT_LINK_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 에디트 모드 처리.
 */
function* chengEditModeToggle({ payload: { editmode } }) {
    yield put({ type: act.CHANGE_DIRECT_LINK_EDIT_MODE_SUCCESS, payload: editmode });
}

export default function* directSaga() {
    yield takeLatest(act.GET_DIRECT_LINK_LIST, getDirectLinkList);
    yield takeLatest(act.GET_DIRECT_LINK, getDirectLink);
    yield takeLatest(act.SAVE_DIRECT_LINK, saveDirectLink);
    yield takeLatest(act.DELETE_DIRECT_LINK, deleteDirectLink);
    yield takeLatest(act.CHANGE_DIRECT_LINK_EDIT_MODE, chengEditModeToggle);
}
