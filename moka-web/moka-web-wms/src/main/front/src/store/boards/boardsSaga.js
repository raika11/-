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
    GET_BOARD_CHANNEL_LIST,
    GET_BOARD_CHANNEL_LIST_SUCCESS,
} from './boardsAction';
import { getBoardInfoList, getBoardInfo, saveBoardInfo, deleteBoard, getBoardGroup, getBoardChannelList } from './boardsApi';

// 게시판 채널 리스트 가지고 오기.
function* getBoardChannelListSaga() {
    yield put(startLoading(GET_SETMENU_BOARD_INFO));
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

            yield put({ type: GET_BOARD_CHANNEL_LIST_SUCCESS, payload: resultList });
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

// 게시판 리스트 가지고 오기
const getSetmenuBoardsListSaga = callApiAfterActions(GET_SETMENU_BOARD_LIST, getBoardInfoList, (state) => state.boards.setmenu);

// 게시판 그룹 리스트 가지고 오기.
const getBoardsGroupListSaga = callApiAfterActions(GET_BOARD_GROUP_LIST, getBoardGroup, (state) => state.boards.listmenu);

// 벌크 상세 정보 ( 기사리스트)
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
function* saveBoardInfoSaga({ payload: { type, boardinfo, callback } }) {
    yield put(startLoading(SAVE_SETMENU_BOARD_INFO));

    let callbackData = {};
    let response;

    try {
        const PostData = {
            boardinfo: boardinfo,
        };

        response = yield call(saveBoardInfo, { PostData });
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

export default function* boardsSaga() {
    yield takeLatest(GET_SETMENU_BOARD_LIST, getSetmenuBoardsListSaga); // 게시판 리스트 가지고 오기.
    yield takeLatest(GET_SETMENU_BOARD_INFO, getBoardInfoSaga); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(SAVE_SETMENU_BOARD_INFO, saveBoardInfoSaga); // 게시판 상세 정보 가지고 오기.
    yield takeLatest(DELETE_SETMENU_BOARD, deleteBoardSaga); // 게시판 삭제.
    yield takeLatest(GET_BOARD_GROUP_LIST, getBoardsGroupListSaga); // 게시판 그룹(트리메뉴).
    yield takeLatest(GET_BOARD_CHANNEL_LIST, getBoardChannelListSaga); // 게시판 채널 리스트 가지고 오기.
}
