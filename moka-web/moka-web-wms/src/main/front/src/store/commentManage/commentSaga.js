import { takeLatest, put, call } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { createRequestSaga, callApiAfterActions, errorResponse } from '@store/commons/saga';
import toast from '@/utils/toastUtil';

import * as act from './commentAction';
import * as api from './commentApi';

/**
 * 댓글 화면 초기 설정 정보 조회
 */
const getInitData = createRequestSaga(act.GET_INIT_DATA, api.getInitData);

/**
 * 목록
 */
const getCommentList = callApiAfterActions(act.GET_COMMENT_LIST, api.getCommentList, (state) => state.comment.comments);
const getCommentsBlocks = callApiAfterActions(act.GET_COMMENTS_BLOCKS, api.getCommentsBlocks, (state) => state.comment.banneds.commentsBlocks);
// const getInitDataSaga = callApiAfterActions(act.GET_INIT_DATA, api.getInitData, (state) => state);

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
            response = yield call(api.putCommentsBlocks, { seqNo: seqNo, blockFormData: blockFormData });
        } else {
            response = yield call(api.postCommentsBlocks, { blockFormData: blockFormData });
        }
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            // 성공
        } else {
            const msg = response.data.header.message;
            toast.error(msg);
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
function* deleteComment({ payload: { cmtSeq, params, callback } }) {
    yield put(startLoading(act.DELETE_COMMENT));

    let callbackData = {};
    let response;

    try {
        response = yield call(api.deleteComment, { cmtSeq: cmtSeq, params: params });
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
function* blocksUsedSaga({ payload: { seqNo, usedYn, callback } }) {
    const ACTION = act.BLOCKS_USED;
    let callbackData = {};

    yield put(startLoading(ACTION));
    let response;

    try {
        response = yield call(api.putCommentsBlocksUsed, { seqNo: seqNo, usedYn: usedYn, callback });
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

// 차단 히스토리 목록 사가.
// const getBlockHistorySaga = callApiAfterActions(act.GET_BLOCK_HISTORY, api.getBlockHistory, (e) => {
//     console.log(e);
// });

function* getBlockHistorySaga({ payload: { seqNo } }) {
    yield put(startLoading(act.GET_BLOCK_HISTORY));

    try {
        let response = yield call(api.getBlockHistory, { seqNo: seqNo });
        yield put({
            type: act.GET_BLOCK_HISTORY_SUCCESS,
            payload: response.data,
        });
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }

    yield put(finishLoading(act.GET_BLOCK_HISTORY));
}

export default function* commentSaga() {
    yield takeLatest(act.GET_INIT_DATA, getInitData);
    yield takeLatest(act.GET_COMMENT_LIST, getCommentList);
    yield takeLatest(act.SAVE_BLOCKS, saveBlock);
    yield takeLatest(act.DELETE_COMMENT, deleteComment);
    yield takeLatest(act.GET_COMMENTS_BLOCKS, getCommentsBlocks);
    yield takeLatest(act.BLOCKS_USED, blocksUsedSaga);
    yield takeLatest(act.GET_BLOCK_HISTORY, getBlockHistorySaga);
}
