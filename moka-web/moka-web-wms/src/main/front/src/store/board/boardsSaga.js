import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import * as act from './boardsAction';
import * as api from './boardsApi';

// 게시판 채널 리스트
function* getBoardChannelTypeList({ callback }) {
    yield put(startLoading(act.GET_BOARD_CHANNEL_TYPE_LIST));
    let response, callbackData;

    try {
        response = yield call(api.getBoardChannelList);
        callbackData = response.data;

        if (response.data.header.success) {
            // yield put({ type: GET_SET_MENU_BOARD_INFO_SUCCESS, payload: response.data });
            const { list } = response.data.body;
            const resultList = list.map((element) => {
                return {
                    seqNo: element.seqNo,
                    dtlCd: element.dtlCd,
                    cdNm: element.cdNm,
                    cdEngNm: element.cdEngNm,
                };
            });

            yield put({ type: act.GET_BOARD_CHANNEL_TYPE_LIST_SUCCESS, payload: resultList });
        } else {
            // 에러 나면 서버 에러 메시지 토스트 전달
            toast.error(response.data.header.message);
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.GET_BOARD_CHANNEL_TYPE_LIST));
}

/**
 * 게시판 채널 (JPOD, 기자) 리스트 가지고 와서 store에 저장
 */
function* getBoardChannelList({ payload: { type, callback } }) {
    yield put(startLoading(act.GET_BOARD_CHANNEL_LIST));
    let response, callbackData;
    try {
        if (type === 'BOARD_DIVC1') {
            // jpod 채널 리스트 목록
            response = yield call(api.getBoardJpodChannalList);
            callbackData = response.data;

            if (response.data.header.success) {
                const { list } = response.data.body;
                callbackData = list.map((data) => {
                    return {
                        name: data.chnlNm,
                        value: data.chnlSeq,
                    };
                });
            } else {
                toast.error(response.data.header.success);
            }
        } else if (type === 'BOARD_DIVC2') {
            // 기자 목록
            response = yield call(api.getBoardReportersChannalList);
            callbackData = response.data;

            if (response.data.header.success) {
                const { list } = response.data.body;
                callbackData = list.map((data) => {
                    return {
                        name: data.repName,
                        label: data.repName,
                        value: data.repSeq,
                    };
                });
            } else {
                toast.error(response.data.header.success);
            }
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.GET_BOARD_CHANNEL_LIST));
}

/**
 * 게시판 목록
 */
const getSetMenuBoardsListSaga = callApiAfterActions(act.GET_SET_MENU_BOARD_LIST, api.getBoardInfoList, (state) => state.board.setMenu);

/**
 * 게시판 그룹 목록
 */
const getBoardGroupList = createRequestSaga(act.GET_BOARD_GROUP_LIST, api.getBoardGroup);

/**
 * 전체 게시판 상세 정보
 */
const getBoardInfo = createRequestSaga(act.GET_SET_MENU_BOARD_INFO, api.getBoardInfo);

/**
 * 게시판 저장
 */
function* saveBoardInfo({ payload: { boardInfo, callback } }) {
    let response, callbackData;

    yield put(startLoading(act.SAVE_BOARD_INFO));

    try {
        // 등록 수정 분기
        response = yield call(boardInfo.boardId ? api.putBoardInfo : api.postBoardInfo, { boardInfo });
        callbackData = response.data;

        if (response.data.header.success) {
            // 목록 조회
            const search = yield select(({ board }) => board.setMenu.search);
            yield put({
                type: act.GET_SET_MENU_BOARD_LIST,
                payload: { search },
            });
        }
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.SAVE_BOARD_INFO));
}

/**
 * 게시판 삭제
 */
function* deleteBoardSaga({ payload: { boardId, callback } }) {
    yield put(startLoading(act.DELETE_SET_MENU_BOARD));
    let callbackData = {};
    let response;
    try {
        response = yield call(api.deleteBoard, { boardId: boardId });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.DELETE_SET_MENU_BOARD));
}

/**
 * 게시글 tree 메뉴 선택시 게시판 상세 조회
 */
const getListMenuSelectBoard = createRequestSaga(act.GET_LIST_MENU_SELECT_BOARD, api.getBoardInfo);

/**
 * 게시글 게시판 목록 조회
 */
function* getListMenuContentsList({ payload: boardId }) {
    yield put(startLoading(act.GET_LIST_MENU_CONTENTS_LIST));

    let response;
    try {
        const search = yield select((store) => store.board.listMenu.contentsList.search);
        response = yield call(api.getBoardContentsList, { boardId: boardId, search: search });
        if (response.data.header.success) {
            yield put({ type: act.GET_LIST_MENU_CONTENTS_LIST_SUCCESS, payload: response.data });
        } else {
            yield put({ type: act.GET_LIST_MENU_CONTENTS_LIST_FAILURE, payload: response.data });
        }
    } catch (e) {
        yield put({ type: act.GET_LIST_MENU_CONTENTS_LIST_FAILURE, payload: errorResponse(e) });
    }

    yield put(finishLoading(act.GET_LIST_MENU_CONTENTS_LIST));
}

/**
 * 게시글 게시판 상세 조회
 */
const getListMenuContentsInfo = createRequestSaga(act.GET_LIST_MENU_CONTENTS_INFO, api.getBoardContentsInfo);

/**
 * 게시글 등록
 */
function* saveBoardContents({ payload: { boardId, formData, callback } }) {
    yield put(startLoading(act.SAVE_BOARD_CONTENTS));

    let callbackData = {};
    let response;

    try {
        const PostData = {
            boardId: boardId,
            formData: formData,
        };
        response = yield call(api.saveBoardContents, { PostData });
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

    yield put(finishLoading(act.SAVE_BOARD_CONTENTS));
}

/**
 * 게시글 수정
 */
function* updateBoardContents({ payload: { boardId, boardSeq, formData, callback } }) {
    yield put(startLoading(act.UPDATE_BOARD_CONTENTS));

    let callbackData = {};
    let response;

    try {
        response = yield call(api.updateBoardContents, {
            boardId: boardId,
            boardSeq: boardSeq,
            formData: formData,
        });
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

    yield put(finishLoading(act.UPDATE_BOARD_CONTENTS));
}

/**
 * 게시글 삭제
 */
function* deleteBoardContents({ payload: { boardId, boardSeq, callback } }) {
    yield put(startLoading(act.DELETE_BOARD_CONTENTS));

    let callbackData = {};
    let response;

    try {
        response = yield call(api.deleteBoardContents, {
            boardId: boardId,
            boardSeq: boardSeq,
        });
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

    yield put(finishLoading(act.DELETE_BOARD_CONTENTS));
}

/**
 * 답변 등록 및 수정
 */
function* saveBoardReply({ payload: { boardId, parentBoardSeq, boardSeq, contents, callback } }) {
    yield put(startLoading(act.SAVE_BOARD_REPLY));

    let callbackData = {};
    let response;

    try {
        // 등록 수정 분기
        if (!parentBoardSeq) {
            // 답변 등록
            response = yield call(api.saveBoardReply, {
                boardId: boardId,
                parentBoardSeq: boardSeq,
                contents: contents,
                files: [], // 답변은 첨부 파일이 없어서 null 처리
            });
        } else {
            // 답변 수정
            response = yield call(api.updateBoardReply, {
                boardId: boardId,
                parentBoardSeq: parentBoardSeq,
                boardSeq: boardSeq,
                contents: contents,
                files: [], // 답변은 첨부 파일이 없어서 null 처리
            });
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

    yield put(finishLoading(act.SAVE_BOARD_REPLY));
}

/**
 * 게시글 썸머노트 이미지 등록
 */
function* uploadBoardContentsImage({ payload: { boardId, imageForm, callback } }) {
    yield put(startLoading(act.UPLOAD_BOARD_CONTENTS_IMAGE));

    let callbackData = {};
    let response;

    try {
        response = yield call(api.uploadBoardContentImage, {
            boardId: boardId,
            imageForm: imageForm,
        });
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

    yield put(finishLoading(act.UPLOAD_BOARD_CONTENTS_IMAGE));
}

export default function* boardsSaga() {
    yield takeLatest(act.GET_SET_MENU_BOARD_LIST, getSetMenuBoardsListSaga); // 게시판 리스트 가지고 오기.
    yield takeLatest(act.GET_SET_MENU_BOARD_INFO, getBoardInfo); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(act.SAVE_BOARD_INFO, saveBoardInfo); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(act.DELETE_SET_MENU_BOARD, deleteBoardSaga); // 게시판 삭제.
    yield takeLatest(act.GET_BOARD_GROUP_LIST, getBoardGroupList); // 게시판 그룹(트리메뉴)
    yield takeLatest(act.GET_BOARD_CHANNEL_TYPE_LIST, getBoardChannelTypeList); // 게시판 채널 리스트
    yield takeLatest(act.GET_BOARD_CHANNEL_LIST, getBoardChannelList); // 게시판 채널 리스트

    yield takeLatest(act.GET_LIST_MENU_SELECT_BOARD, getListMenuSelectBoard); // 게시글 tree 메뉴 선택시 게시판 상세 조회
    yield takeLatest(act.GET_LIST_MENU_CONTENTS_LIST, getListMenuContentsList); // 게시글 게시판 글 목록 조회
    yield takeLatest(act.GET_LIST_MENU_CONTENTS_INFO, getListMenuContentsInfo); // 게시글 게시판 상세 조회

    yield takeLatest(act.SAVE_BOARD_CONTENTS, saveBoardContents); // 게시글 등록
    yield takeLatest(act.UPDATE_BOARD_CONTENTS, updateBoardContents); // 게시글 수정
    yield takeLatest(act.DELETE_BOARD_CONTENTS, deleteBoardContents); // 게시글 삭제
    yield takeLatest(act.SAVE_BOARD_REPLY, saveBoardReply); // 게시글 답변 등록

    yield takeLatest(act.UPLOAD_BOARD_CONTENTS_IMAGE, uploadBoardContentsImage); // 게시글 본문 이미지 업로드.
}
