import { handleActions } from 'redux-actions';
import produce from 'immer';
import moment from 'moment';
import {
    CLEAR_STORE,
    INITIALIZE_PARAMS,
    CHANGE_SETMENU_SEARCH_OPTION,
    CLEAR_SETMENU_SEARCH_OPTION,
    GET_SETMENU_BOARD_LIST_SUCCESS,
    GET_SETMENU_BOARD_INFO_SUCCESS,
    CLEAR_SETMENU_BOARD_INFO,
    GET_GROUP_LIST_SUCCESS,
    GET_BOARD_CHANNELTYPE_LIST_SUCCESS,
    CHANGE_LISTMENU_SEARCH_OPTION,
    CLEAR_LISTMENU_SEARCH_OPTION,
    GET_LISTMENU_CONTENTS_LIST_SUCCESS,
    GET_LISTMENU_CONTENTS_INFO_SUCCESS,
    CLEAR_LISTMENU_CONTENTSINFO,
    GET_LISTMENU_SELECT_BOARD_SUCCESS,
} from './boardsAction';
import { PAGESIZE_OPTIONS } from '@/constants';

const initContentInfo = {
    addr: null,
    attaches: [],
    boardId: null,
    boardInfo: null,
    boardSeq: null,
    channelId: 0,
    content: null,
    declareCnt: 0,
    decomCnt: 0,
    delYn: 'N',
    depth: 0,
    indent: 0,
    ordNo: '1',
    parentBoardSeq: null,
    pwd: null,
    recomCnt: 0,
    regIp: null,
    regName: null,
    title: null,
    titlePrefix1: null,
    titlePrefix2: null,
    viewCnt: 0,
    regInfo: '',
    modInfo: '',
    regDt: '',
    modDt: '',
};

export const initialState = {
    pagePathName: '',
    gubun: '',
    boardType: '',
    channeltype_list: [],
    setmenu: {
        total: 0,
        list: [],
        search: {
            page: 0,
            sort: 'boardId,desc',
            size: PAGESIZE_OPTIONS[0],
            usedYn: '',
            searchType: '',
            keyword: '',
        },
        boardinfo: {
            boardId: null,
            boardName: null,
            boardType: null,
            usedYn: 'Y',
            titlePrefix1: null,
            titlePrefix2: null,
            insLevel: 1,
            viewLevel: 1,
            answLevel: 1,
            replyLevel: 1,
            editorYn: 'N',
            answYn: 'N',
            replyYn: 'N',
            fileYn: 'N',
            allowFileCnt: 0,
            allowFileSize: 0,
            allowFileExt: '',
            recomFlag: null,
            declareYn: 'N',
            captchaYn: 'N',
            channelType: null,
            boardDesc: null,
            emailReceiveYn: 'N',
            receiveEmail: null,
            sendEmail: null,
            emailSendYn: 'N',
            exceptItem: null,
        },
    },
    listmenu: {
        groupList: [],
        selectboard: {},
        contentsList: {
            total: 0,
            list: [],
            search: {
                page: 0,
                sort: 'boardSeq,desc',
                size: PAGESIZE_OPTIONS[0],
                usedYn: 'Y',
                searchType: '',
                keyword: '',
                startDt: moment().format('YYYY-MM-DD 00:00:00'),
                endDt: moment().format('YYYY-MM-DD 23:59:00'),
                titlePrefix1: '',
            },
        },
        contents: {
            info: initContentInfo,
            reply: initContentInfo,
        },
    },
};

export default handleActions(
    {
        // 전체 초기화.
        [CLEAR_STORE]: () => initialState,
        // 구분값 제외 초기화.
        [INITIALIZE_PARAMS]: (state, { payload: { pagePathName, boardType, gubun } }) => {
            return produce(state, (draft) => {
                draft.pagePathName = pagePathName;
                draft.boardType = boardType;
                draft.gubun = gubun;
            });
        },
        // 게시판 등록시 사용할 채널 타입 리스트 처리.
        [GET_BOARD_CHANNELTYPE_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channeltype_list = payload;
            });
        },
        // set 메뉴 검색 옵션 처리.
        [CHANGE_SETMENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setmenu.search = payload;
            });
        },
        // 게시판 검색 옵션 클리어.
        [CLEAR_SETMENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setmenu.search = initialState.setmenu.search;
            });
        },
        // list 메뉴 검색 옵션 처리.
        [CHANGE_LISTMENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.listmenu.contentsList.search = payload;
            });
        },
        // 게기판 게시글 검색 옵션 클리어.
        [CLEAR_LISTMENU_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.listmenu.contentsList.search = initialState.listmenu.contentsList.search;
            });
        },
        // 리스트 조회 성공.
        [GET_SETMENU_BOARD_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.setmenu.list = body.list;
                draft.setmenu.total = body.totalCnt;
            });
        },
        // 상세 조회 성공.
        [GET_SETMENU_BOARD_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.setmenu.boardinfo = body;
            });
        },
        // 게시판 설정 정보 처리.
        [CLEAR_SETMENU_BOARD_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.setmenu.boardinfo = initialState.setmenu.boardinfo;
            });
        },
        // Tree 메뉴 리스트 정상 처리.
        [GET_GROUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listmenu.groupList = body;
            });
        },
        // 트리메뉴에서 게시판 클릭 처리. ( 하위 페이지에서 옵션 처리 하기 위해.)
        [GET_LISTMENU_SELECT_BOARD_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listmenu.selectboard = body;
            });
        },
        // 리스트 조회 성공.
        [GET_LISTMENU_CONTENTS_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listmenu.contentsList.list = body.list;
                draft.listmenu.contentsList.total = body.totalCnt;
            });
        },
        // 게시판 게시글 정보 처리.
        [GET_LISTMENU_CONTENTS_INFO_SUCCESS]: (state, { payload: { body } }) => {
            const { boardSeq, parentBoardSeq } = body;
            if (boardSeq === parentBoardSeq) {
                return produce(state, (draft) => {
                    draft.listmenu.contents.info = body;
                    draft.listmenu.contents.reply = initialState.listmenu.contents.reply;
                });
            } else {
                return produce(state, (draft) => {
                    draft.listmenu.contents.info = initialState.listmenu.contents.info;
                    draft.listmenu.contents.reply = body;
                });
            }
        },
        // 선택한 게시글 정보 클리어 처리.
        [CLEAR_LISTMENU_CONTENTSINFO]: (state) => {
            return produce(state, (draft) => {
                draft.listmenu.contents.info = initialState.listmenu.contents.info;
            });
        },
    },
    initialState,
);
