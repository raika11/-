import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './boardsAction';
import { PAGESIZE_OPTIONS } from '@/constants';

const initContentInfo = {
    boardId: null,
    parentBoardSeq: null,
    regName: '',
    regId: '',
    depth: 0,
    indent: 0,
    viewCnt: 0,
    recomCnt: 0,
    decomCnt: 0,
    declareCnt: 0,
    delYn: 'N',
    regIp: '',
    boardInfo: {},
    attaches: [],
    channelId: 0,
    titlePrefix1: '',
    titlePrefix2: '',
    title: '',
    ordNo: 99,
    content: '',
    pwd: null,
    addr: null,
    pushReceiveYn: 'N',
    emailReceiveYn: 'N',
    appOs: null,
    devDiv: null,
    token: null,
    email: null,
    mobilePhone: null,
    url: null,
    jpodChannel: null,
    regDt: '',
    modDt: '',
    // boardSeq: null,
    // regInfo: '',
    // modInfo: '',
};

export const initialState = {
    pagePathName: '',
    gubun: '',
    boardType: '',
    channelTypeList: [],
    setMenu: {
        total: 0,
        list: [],
        error: null,
        search: {
            sort: 'boardId,desc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            useTotal: '',
            usedYn: '',
            channelType: '',
        },
        boardInfo: {
            boardType: '',
            channelType: null,
            usedYn: 'Y',
            titlePrefixNm1: '',
            titlePrefixNm2: '',
            titlePrefix1: '',
            titlePrefix2: '',
            insLevel: '1',
            viewLevel: '1',
            answLevel: '1',
            replyLevel: '0',
            recomFlag: '0',
            editorYn: 'N',
            answYn: 'N',
            replyYn: 'N',
            declareYn: 'N',
            captchaYn: 'N',
            secretYn: 'N',
            ordYn: 'N',
            pushYn: 'N',
            emailReceiveYn: 'Y',
            receiveEmail: '',
            answPushYn: 'Y',
            emailSendYn: 'N',
            sendEmail: '',
            fileYn: 'N',
            allowFileCnt: 0,
            allowFileSize: 0,
            allowFileExt: 'zip,xls,xlsx,ppt,doc,hwp,jpg,png,gif',
            allowItem: '',
            regDt: '',
            boardUrl: '',
            boardName: '',
            boardDesc: '',
            headerContent: null,
            footerContent: null,
        },
    },
    listMenu: {
        groupList: [],
        selectBoard: {},
        contentsList: {
            total: 0,
            list: [],
            error: null,
            search: {
                page: 0,
                size: PAGESIZE_OPTIONS[0],
                searchType: '',
                keyword: '',
                useTotal: '',
                startDt: null,
                endDt: null,
                delYn: 'N',
                titlePrefix1: '',
                titlePrefix2: '',
                channelId: '',
                parentBoardSeq: '',
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
        // 스토어 초기화
        [act.CLEAR_STORE]: () => initialState,
        // 구분값을 제외한 나머지 초기화
        [act.INITIALIZE_PARAMS]: (state, { payload: { pagePathName, boardType, gubun } }) => {
            return produce(state, (draft) => {
                draft.pagePathName = pagePathName;
                draft.boardType = boardType;
                draft.gubun = gubun;
            });
        },
        // 게시판 등록 시 사용할 채널 타입 목록
        [act.GET_BOARD_CHANNEL_TYPE_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channelTypeList = payload;
            });
        },
        // set 메뉴 검색 옵션 처리
        [act.CHANGE_SET_MENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setMenu.search = payload;
            });
        },
        // list 메뉴 검색 옵션 처리
        [act.CHANGE_LIST_MENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.listMenu.contentsList.search = payload;
            });
        },
        // 게시판 게시글 search option 초기화
        [act.CLEAR_LIST_MENU_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.listMenu.contentsList.search = initialState.listMenu.contentsList.search;
            });
        },
        // 전체 게시판 목록 조회
        [act.GET_SET_MENU_BOARD_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.setMenu.list = body.list;
                draft.setMenu.total = body.totalCnt;
                draft.setMenu.error = initialState.setMenu.error;
            });
        },
        [act.GET_SET_MENU_BOARD_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setMenu.list = initialState.setMenu.list;
                draft.setMenu.total = initialState.setMenu.totalCnt;
                draft.setMenu.error = payload;
            });
        },
        // 전체 게시판 상세 조회
        [act.GET_SET_MENU_BOARD_INFO_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.setMenu.boardInfo = body;
            });
        },
        [act.GET_SET_MENU_BOARD_INFO_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.setMenu.boardInfo = initialState.setMenu.boardInfo;
            });
        },
        // 전체 게시판 초기화
        [act.CLEAR_SET_MENU_BOARD_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.setMenu.boardInfo = initialState.setMenu.boardInfo;
            });
        },
        // 게시판 유형 그룹별 게시판 목록 조회(tree)
        [act.GET_BOARD_GROUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listMenu.groupList = body;
            });
        },
        // 게시글 트리 메뉴 (하위 페이지에서 옵션 처리 하기 위해)
        [act.GET_LIST_MENU_SELECT_BOARD_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listMenu.selectBoard = body;
            });
        },
        // 게시글 게시판 목록 조회
        [act.GET_LIST_MENU_CONTENTS_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listMenu.contentsList.list = body.list;
                draft.listMenu.contentsList.total = body.totalCnt;
                draft.listMenu.contentsList.error = initialState.listMenu.contentsList.error;
            });
        },
        [act.GET_LIST_MENU_CONTENTS_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.listMenu.contentsList.list = initialState.listMenu.contentsList.list;
                draft.listMenu.contentsList.total = initialState.listMenu.contentsList.total;
                draft.listMenu.contentsList.error = payload;
            });
        },
        // 게시글 게시판 상세 조회
        [act.GET_LIST_MENU_CONTENTS_INFO_SUCCESS]: (state, { payload: { body } }) => {
            const { boardSeq, parentBoardSeq } = body;
            if (boardSeq === parentBoardSeq) {
                return produce(state, (draft) => {
                    draft.listMenu.contents.info = body;
                    draft.listMenu.contents.reply = initialState.listMenu.contents.reply;
                });
            } else {
                return produce(state, (draft) => {
                    draft.listMenu.contents.info = initialState.listMenu.contents.info;
                    draft.listMenu.contents.reply = body;
                });
            }
        },
        [act.GET_LIST_MENU_CONTENTS_INFO_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.listMenu.contents.info = initialState.listMenu.contents.info;
                draft.listMenu.contents.reply = initialState.listMenu.contents.reply;
            });
        },
        // 게시글 게시판 상세 정보 초기화
        [act.CLEAR_LIST_MENU_CONTENTS_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.listMenu.contents = initialState.listMenu.contents;
            });
        },
        // 게시글 정보 변경
        [act.CHANGE_LIST_MENU_CONTENTS]: (state, { payload: { content } }) => {
            return produce(state, (draft) => {
                draft.listMenu.contents.info.content = content;
            });
        },
        // 게시글 답글 정보 변경
        [act.CHANGE_LIST_MENU_REPLY_CONTENTS]: (state, { payload: { content } }) => {
            return produce(state, (draft) => {
                draft.listMenu.contents.reply.content = content;
            });
        },
    },
    initialState,
);
