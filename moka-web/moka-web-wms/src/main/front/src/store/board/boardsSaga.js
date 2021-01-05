import { takeLatest, put, select, call } from 'redux-saga/effects';
import toast from '@/utils/toastUtil';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, errorResponse } from '@store/commons/saga';
import {
    DELETE_SETMENU_BOARD,
    GET_SETMENU_BOARD_LIST,
    GET_SETMENU_BOARD_INFO,
    GET_SETMENU_BOARD_INFO_SUCCESS,
    SAVE_SETMENU_BOARD_INFO,
    GET_BOARD_GROUP_LIST,
    GET_BOARD_CHANNELTYPE_LIST,
    GET_BOARD_CHANNELTYPE_LIST_SUCCESS,
    GET_LISTMENU_CONTENTS_LIST,
    GET_LISTMENU_CONTENTS_LIST_SUCCESS,
    GET_LISTMENU_CONTENTS_INFO,
    GET_LISTMENU_CONTENTS_INFO_SUCCESS,
    GET_LISTMENU_SELECT_BOARD,
    GET_LISTMENU_SELECT_BOARD_SUCCESS,
    GET_BOARD_CHANNEL_LIST,
    SAVE_BOARD_CONTENTS,
    DELETE_BOARD_CONTENTS,
    UPDATE_BOARD_CONTENTS,
    SAVE_BOARD_REPLY,
    UPLOAD_BOARD_CONTENT_IMAGE,
} from './boardsAction';
import {
    getBoardInfoList,
    getBoardInfo,
    saveBoardInfo,
    deleteBoard,
    getBoardGroup,
    getBoardChannelList,
    getBoardContentsList,
    getBoardContentsInfo,
    getBoardJpodChannalList,
    saveBoardContents,
    deleteBoardContents,
    updateBoardContents,
    saveBoardReply,
    updateBoardReply,
    getBoardReportersChannalList,
    uploadBoardContentImage,
} from './boardsApi';

// 게시판 채널 리스트 가지고 오기.
function* getBoardChannelTypeListSaga() {
    yield put(startLoading(GET_BOARD_CHANNELTYPE_LIST));
    let response;
    try {
        response = yield call(getBoardChannelList);
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            // yield put({ type: GET_SETMENU_BOARD_INFO_SUCCESS, payload: response.data });
            const { list } = response.data.body;
            const resultList = list.map((element) => {
                return {
                    seqNo: element.seqNo,
                    dtlCd: element.dtlCd,
                    cdNm: element.cdNm,
                    cdEngNm: element.cdEngNm,
                };
            });

            yield put({ type: GET_BOARD_CHANNELTYPE_LIST_SUCCESS, payload: resultList });
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
    yield put(finishLoading(GET_BOARD_CHANNELTYPE_LIST));
}

function* getBoardChannelListSaga({ payload: { type, callback } }) {
    yield put(startLoading(GET_BOARD_CHANNEL_LIST));
    let response;
    let callbackData = {};
    try {
        if (type === 'BOARD_DIVC1') {
            response = yield call(getBoardJpodChannalList);

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
        } else if (type === 'BOARD_DIVC2') {
            response = yield call(getBoardReportersChannalList);

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

    yield put(finishLoading(GET_BOARD_CHANNEL_LIST));
}

// 게시판 리스트 가지고 오기
const getSetmenuBoardsListSaga = callApiAfterActions(GET_SETMENU_BOARD_LIST, getBoardInfoList, (state) => state.board.setmenu);
// 게시판 그룹 리스트 가지고 오기.
const getBoardsGroupListSaga = callApiAfterActions(GET_BOARD_GROUP_LIST, getBoardGroup, (state) => state.board.boardType);

// 보드 상세 정보.
function* getBoardInfoSaga({ payload: { boardId } }) {
    yield put(startLoading(GET_SETMENU_BOARD_INFO));
    let response;
    try {
        response = yield call(getBoardInfo, { boardId: boardId });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_SETMENU_BOARD_INFO_SUCCESS, payload: response.data });
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
    yield put(finishLoading(GET_SETMENU_BOARD_INFO));
}

// 게시판 저장.
function* saveBoardInfoSaga({ payload: { boardinfo, callback } }) {
    yield put(startLoading(SAVE_SETMENU_BOARD_INFO));

    let callbackData = {};
    let response;

    try {
        response = yield call(saveBoardInfo, { boardinfo: boardinfo });
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

    yield put(finishLoading(SAVE_SETMENU_BOARD_INFO));
}

function* deleteBoardSaga({ payload: { boardId, callback } }) {
    yield put(startLoading(DELETE_SETMENU_BOARD));
    let callbackData = {};
    let response;
    try {
        response = yield call(deleteBoard, { boardId: boardId });
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(e);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(DELETE_SETMENU_BOARD));
}

function* getListmenuContentsListSaga({ payload: { boardId } }) {
    yield put(startLoading(GET_LISTMENU_CONTENTS_LIST));

    let response;
    try {
        const search = yield select((store) => store.board.listmenu.contentsList.search);
        response = yield call(getBoardContentsList, { boardId: boardId, search: search });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_LISTMENU_CONTENTS_LIST_SUCCESS, payload: response.data });
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

    yield put(finishLoading(GET_LISTMENU_CONTENTS_LIST));
}

function* getListmenuSelectBoardSaga({ payload: { boardId } }) {
    yield put(startLoading(GET_LISTMENU_SELECT_BOARD));
    let response;
    try {
        response = yield call(getBoardInfo, { boardId: boardId });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_LISTMENU_SELECT_BOARD_SUCCESS, payload: response.data });
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
    yield put(finishLoading(GET_LISTMENU_SELECT_BOARD));
}

function* getListmenuContentsInfoSaga({ payload: { boardId, boardSeq } }) {
    yield put(startLoading(GET_LISTMENU_CONTENTS_INFO));

    let response;
    try {
        response = yield call(getBoardContentsInfo, { boardId: boardId, boardSeq: boardSeq });
        const {
            header: { success, message },
        } = response.data;
        if (success === true) {
            yield put({ type: GET_LISTMENU_CONTENTS_INFO_SUCCESS, payload: response.data });
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

    yield put(finishLoading(GET_LISTMENU_CONTENTS_INFO));
}

function* saveBoardContentsSaga({ payload: { boardId, contents, files, callback } }) {
    yield put(startLoading(SAVE_BOARD_CONTENTS));

    let callbackData = {};
    let response;

    try {
        const PostData = {
            boardId: boardId,
            contents: contents,
            files: files,
        };

        response = yield call(saveBoardContents, { PostData });
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

    yield put(finishLoading(SAVE_BOARD_CONTENTS));
}

function* updateBoardContentsSaga({ payload: { boardId, boardSeq, contents, files, callback } }) {
    yield put(startLoading(UPDATE_BOARD_CONTENTS));

    let callbackData = {};
    let response;

    try {
        response = yield call(updateBoardContents, {
            boardId: boardId,
            boardSeq: boardSeq,
            contents: contents,
            files: files,
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

    yield put(finishLoading(UPDATE_BOARD_CONTENTS));
}

function* deleteBoardContentsSaga({ payload: { boardId, boardSeq, callback } }) {
    yield put(startLoading(DELETE_BOARD_CONTENTS));

    let callbackData = {};
    let response;

    try {
        response = yield call(deleteBoardContents, {
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

    yield put(finishLoading(DELETE_BOARD_CONTENTS));
}

function* saveBoardReplySaga({ payload: { boardId, parentBoardSeq, boardSeq, contents, callback } }) {
    yield put(startLoading(SAVE_BOARD_REPLY));

    let callbackData = {};
    let response;

    try {
        // 답변 등록.
        if (parentBoardSeq === null) {
            console.log('new');
            // 답변 등록.
            response = yield call(saveBoardReply, {
                boardId: boardId,
                parentBoardSeq: boardSeq,
                contents: contents,
            });
        } else {
            console.log('update');
            // 답변 수정.
            response = yield call(updateBoardReply, {
                boardId: boardId,
                parentBoardSeq: parentBoardSeq,
                boardSeq: boardSeq,
                contents: contents,
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

    yield put(finishLoading(SAVE_BOARD_REPLY));
}

function* uploadBoardContentImageSaga({ payload: { boardId, imageForm, callback } }) {
    yield put(startLoading(UPLOAD_BOARD_CONTENT_IMAGE));

    let callbackData = {};
    let response;

    try {
        response = yield call(uploadBoardContentImage, {
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

    yield put(finishLoading(UPLOAD_BOARD_CONTENT_IMAGE));
}

export default function* boardsSaga() {
    yield takeLatest(GET_SETMENU_BOARD_LIST, getSetmenuBoardsListSaga); // 게시판 리스트 가지고 오기.
    yield takeLatest(GET_SETMENU_BOARD_INFO, getBoardInfoSaga); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(SAVE_SETMENU_BOARD_INFO, saveBoardInfoSaga); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(DELETE_SETMENU_BOARD, deleteBoardSaga); // 게시판 삭제.
    yield takeLatest(GET_BOARD_GROUP_LIST, getBoardsGroupListSaga); // 게시판 그룹(트리메뉴).
    yield takeLatest(GET_BOARD_CHANNELTYPE_LIST, getBoardChannelTypeListSaga); // 게시판 채널 리스트 가지고 오기.
    yield takeLatest(GET_BOARD_CHANNEL_LIST, getBoardChannelListSaga); // 게시판 채널 리스트 가지고 오기.

    yield takeLatest(GET_LISTMENU_CONTENTS_LIST, getListmenuContentsListSaga); // 게시글 게시판 글 목록 가지고 오기.
    yield takeLatest(GET_LISTMENU_SELECT_BOARD, getListmenuSelectBoardSaga); // 게시글 게시판 글 목록 가지고 오기.
    yield takeLatest(GET_LISTMENU_CONTENTS_INFO, getListmenuContentsInfoSaga); // 게시글 게시판 글 정보 가지고 오기.

    yield takeLatest(SAVE_BOARD_CONTENTS, saveBoardContentsSaga); // 게시글 게시판 글 정보 저장.
    yield takeLatest(UPDATE_BOARD_CONTENTS, updateBoardContentsSaga); // 게시글 게시판 글 정보 수정.
    yield takeLatest(DELETE_BOARD_CONTENTS, deleteBoardContentsSaga); // 게시글 게시판 글 정보 저장.
    yield takeLatest(SAVE_BOARD_REPLY, saveBoardReplySaga); // 게시글 게시판 답변 정보 저장.

    yield takeLatest(UPLOAD_BOARD_CONTENT_IMAGE, uploadBoardContentImageSaga); // 게시글 본문 이미지 업로드.
}
