import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';

import * as commentAPI from './commentApi';
import * as act from './commentAction';

/**
 * 목록
 */
const getCommentList = callApiAfterActions(act.GET_COMMENT_LIST, commentAPI.getCommentList, (state) => state.comment);

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveBlock({ payload: { type, actions, callback } }) {
    const ACTION = act.SAVE_BLOCK;
    let callbackData = {};

    yield put(startLoading(ACTION));

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

        // 댓글 데이터
        const comment = yield select((store) => store.comment.comment);
        const response = yield call(commentAPI.postBlock, { comment });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 다시 검색
            yield put({ type: act.GET_COMMENT_LIST });
        } else {
            const { body } = response.data.body;

            if (body && body.list && Array.isArray(body.list)) {
                // invalidList 셋팅
                yield put({
                    type: act.CHANGE_INVALID_LIST,
                    payload: response.data.body.list,
                });
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string} param0.payload.commentSeq 댓글아이디
 * @param {func} param0.payload.callback 콜백
 */
function* deleteComment({ payload: { commentSeq, callback } }) {
    const ACTION = act.DELETE_COMMENT;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(commentAPI.deleteComment, { commentSeq });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({ type: act.DELETE_COMMENT_SUCCESS });

            // 목록 다시 검색
            yield put({ type: act.GET_COMMENT_LIST });

            // auth 댓글 목록 다시 조회
            //yield put(getCommentList());
        } else {
            yield put({
                type: act.DELETE_COMMENT_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);

        yield put({
            type: act.DELETE_COMMENT_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* commentSaga() {
    yield takeLatest(act.GET_COMMENT_LIST, getCommentList);
    yield takeLatest(act.SAVE_BLOCK, saveBlock);
    yield takeLatest(act.DELETE_COMMENT, deleteComment);
}
