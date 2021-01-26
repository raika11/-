import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import toast from '@/utils/toastUtil';

import * as act from './commentAction';
import * as commentAPI from './commentApi';

/**
 * 목록
 */
const getCommentList = callApiAfterActions(act.GET_COMMENT_LIST, commentAPI.getCommentList, (state) => state.comment.comments);
const getCommentsBlocksSaga = callApiAfterActions(act.GET_COMMENTS_BLOCKS, commentAPI.getCommentsBlocks, (state) => state.comment.banneds.commentsBlocks);

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveBlock({ payload: { type, seqNo, blockFormData, callback } }) {
    const ACTION = act.SAVE_BLOCKS;
    let callbackData = {};

    yield put(startLoading(ACTION));
    let response;

    try {
        if (type === 'UPDATE') {
            response = yield call(commentAPI.putCommentsBlocks, { seqNo: seqNo, blockFormData: blockFormData });
        } else {
            response = yield call(commentAPI.postCommentsBlocks, { blockFormData: blockFormData });
        }

        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
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
function* deleteComment({ payload: { cmtSeq, callback } }) {
    yield put(startLoading(act.DELETE_COMMENT));

    let callbackData = {};
    let response;

    try {
        response = yield call(commentAPI.deleteComment, { cmtSeq: cmtSeq });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.DELETE_COMMENT));
}

// 차단 목록 차단// 복원
function* blocksUsedSaga({ payload: { seqNo, usedForm, callback } }) {
    const ACTION = act.BLOCKS_USED;
    let callbackData = {};

    yield put(startLoading(ACTION));
    let response;

    try {
        response = yield call(commentAPI.putCommentsBlocksUsed, { seqNo: seqNo, usedForm: usedForm, callback });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }
    yield put(finishLoading(ACTION));
}

export default function* commentSaga() {
    yield takeLatest(act.GET_COMMENT_LIST, getCommentList);
    yield takeLatest(act.SAVE_BLOCKS, saveBlock);
    yield takeLatest(act.DELETE_COMMENT, deleteComment);
    yield takeLatest(act.GET_COMMENTS_BLOCKS, getCommentsBlocksSaga);
    yield takeLatest(act.BLOCKS_USED, blocksUsedSaga);
}
