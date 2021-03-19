import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '@store/commons/saga';
import * as act from './boardsAction';
import * as api from './boardsApi';

// 게시판 채널 리스트 가지고 오기.
function* getBoardChannelTypeListSaga() {
    yield put(startLoading(act.GET_BOARD_CHANNELTYPE_LIST));
    let response;
    try {
        response = yield call(api.getBoardChannelList);
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
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

            yield put({ type: act.GET_BOARD_CHANNELTYPE_LIST_SUCCESS, payload: resultList });
        } else {
            // 에러 나면 서버 에러 메시지 토스트 전달.
            toast.error(message);
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    yield put(finishLoading(act.GET_BOARD_CHANNELTYPE_LIST));
}

// 게시판 채널 (JPOD, 기자) 리스트 가지고 와서 조합 해서 store 에 저장.
function* getBoardChannelListSaga({ payload: { type, callback } }) {
    yield put(startLoading(act.GET_BOARD_CHANNEL_LIST));
    let response;
    let callbackData = {};
    try {
        // jpod 채널 리스트 목록 가지고 오기.
        if (type === 'BOARD_DIVC1') {
            response = yield call(api.getBoardJpodChannalList);

            const {
                header: { success, message },
                body: { list },
            } = response.data;

            if (success === true) {
                callbackData = list.map((data) => {
                    return {
                        name: data.chnlNm,
                        value: data.chnlSeq,
                    };
                });
            } else {
                toast.error(message);
            }
            // 기자 목록 가지고 오기.
        } else if (type === 'BOARD_DIVC2') {
            response = yield call(api.getBoardReportersChannalList);

            const {
                header: { success, message },
                body: { list },
            } = response.data;

            if (success === true) {
                callbackData = list.map((data) => {
                    return {
                        name: data.repName,
                        label: data.repName,
                        value: data.repSeq,
                    };
                });
            } else {
                toast.error(message);
            }
        }
    } catch (e) {
        const {
            header: { message },
        } = errorResponse(e);
        toast.error(message);
    }
    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(act.GET_BOARD_CHANNEL_LIST));
}

// 게시판 리스트 가지고 오기
const getSetMenuBoardsListSaga = callApiAfterActions(act.GET_SET_MENU_BOARD_LIST, api.getBoardInfoList, (state) => state.board.setMenu);

/**
 * 게시판 그룹 목록
 */
const getBoardGroupList = createRequestSaga(act.GET_BOARD_GROUP_LIST, api.getBoardGroup);

/**
 * 전체 게시판 상세 정보
 */
const getBoardInfo = createRequestSaga(act.GET_SET_MENU_BOARD_INFO, api.getBoardInfo);

// 게시판 저장.
function* saveBoardInfoSaga({ payload: { boardInfo, callback } }) {
    yield put(startLoading(act.SAVE_SET_MENU_BOARD_INFO));

    let callbackData = {};
    let response;

    try {
        response = yield call(api.saveBoardInfo, { boardInfo: boardInfo });
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

    yield put(finishLoading(act.SAVE_SET_MENU_BOARD_INFO));
}

// 게시판 삭제.
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

// 게시글 등록 하기.
function* saveBoardContentsSaga({ payload: { boardId, formData, callback } }) {
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

// 게시글 정보 수정.
function* updateBoardContentsSaga({ payload: { boardId, boardSeq, formData, callback } }) {
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

// 게시글 삭제.
function* deleteBoardContentsSaga({ payload: { boardId, boardSeq, callback } }) {
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

// 답변 등록 및 수정.
function* saveBoardReplySaga({ payload: { boardId, parentBoardSeq, boardSeq, contents, callback } }) {
    yield put(startLoading(act.SAVE_BOARD_REPLY));

    let callbackData = {};
    let response;

    try {
        // 답변 등록.
        if (parentBoardSeq === null) {
            // 답변 등록.
            response = yield call(api.saveBoardReply, {
                boardId: boardId,
                parentBoardSeq: boardSeq,
                contents: contents,
                files: [], // 답변은 첨부 파일이 없어서 null 처리
            });
        } else {
            // 답변 수정.
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

// 게시글 본문 에디터에서 이미지 등록 하기.
function* uploadBoardContentImageSaga({ payload: { boardId, imageForm, callback } }) {
    yield put(startLoading(act.UPLOAD_BOARD_CONTENT_IMAGE));

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

    yield put(finishLoading(act.UPLOAD_BOARD_CONTENT_IMAGE));
}

export default function* boardsSaga() {
    yield takeLatest(act.GET_SET_MENU_BOARD_LIST, getSetMenuBoardsListSaga); // 게시판 리스트 가지고 오기.
    yield takeLatest(act.GET_SET_MENU_BOARD_INFO, getBoardInfo); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(act.SAVE_SET_MENU_BOARD_INFO, saveBoardInfoSaga); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(act.DELETE_SET_MENU_BOARD, deleteBoardSaga); // 게시판 삭제.
    yield takeLatest(act.GET_BOARD_GROUP_LIST, getBoardGroupList); // 게시판 그룹(트리메뉴)
    yield takeLatest(act.GET_BOARD_CHANNELTYPE_LIST, getBoardChannelTypeListSaga); // 게시판 채널 리스트 가지고 오기.
    yield takeLatest(act.GET_BOARD_CHANNEL_LIST, getBoardChannelListSaga); // 게시판 채널 리스트 가지고 오기.

    yield takeLatest(act.GET_LIST_MENU_SELECT_BOARD, getListMenuSelectBoard); // 게시글 tree 메뉴 선택시 게시판 상세 조회
    yield takeLatest(act.GET_LIST_MENU_CONTENTS_LIST, getListMenuContentsList); // 게시글 게시판 글 목록 조회
    yield takeLatest(act.GET_LIST_MENU_CONTENTS_INFO, getListMenuContentsInfo); // 게시글 게시판 상세 조회

    yield takeLatest(act.SAVE_BOARD_CONTENTS, saveBoardContentsSaga); // 게시글 게시판 글 정보 저장.
    yield takeLatest(act.UPDATE_BOARD_CONTENTS, updateBoardContentsSaga); // 게시글 게시판 글 정보 수정.
    yield takeLatest(act.DELETE_BOARD_CONTENTS, deleteBoardContentsSaga); // 게시글 게시판 글 정보 저장.
    yield takeLatest(act.SAVE_BOARD_REPLY, saveBoardReplySaga); // 게시글 게시판 답변 정보 저장.

    yield takeLatest(act.UPLOAD_BOARD_CONTENT_IMAGE, uploadBoardContentImageSaga); // 게시글 본문 이미지 업로드.
}
