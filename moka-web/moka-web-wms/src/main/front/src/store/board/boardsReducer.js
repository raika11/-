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
    reserveDt: null,
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
    boardSeq: null,
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
            emailReceiveYn: 'N',
            receiveEmail: '',
            answPushYn: 'N',
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
            headerContent: '',
            footerContent: '',
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
        // ????????? ?????????
        [act.CLEAR_STORE]: () => initialState,
        // ???????????? ????????? ????????? ?????????
        [act.INITIALIZE_PARAMS]: (state, { payload: { pagePathName, boardType, gubun } }) => {
            return produce(state, (draft) => {
                draft.pagePathName = pagePathName;
                draft.boardType = boardType;
                draft.gubun = gubun;
            });
        },
        // ????????? ?????? ??? ????????? ?????? ?????? ??????
        [act.GET_BOARD_CHANNEL_TYPE_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channelTypeList = payload;
            });
        },
        // set ?????? ?????? ?????? ??????
        [act.CHANGE_SET_MENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setMenu.search = payload;
            });
        },
        // list ?????? ?????? ?????? ??????
        [act.CHANGE_LIST_MENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.listMenu.contentsList.search = payload;
            });
        },
        // ????????? ????????? search option ?????????
        [act.CLEAR_LIST_MENU_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.listMenu.contentsList.search = initialState.listMenu.contentsList.search;
            });
        },
        // ?????? ????????? ?????? ??????
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
        // ?????? ????????? ?????? ??????
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
        // ?????? ????????? ?????????
        [act.CLEAR_SET_MENU_BOARD_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.setMenu.boardInfo = initialState.setMenu.boardInfo;
            });
        },
        // ????????? ?????? ????????? ????????? ?????? ??????(tree)
        [act.GET_BOARD_GROUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listMenu.groupList = body;
            });
        },
        // ????????? ?????? ?????? (?????? ??????????????? ?????? ?????? ?????? ??????)
        [act.GET_LIST_MENU_SELECT_BOARD_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listMenu.selectBoard = body;
            });
        },
        // ????????? ????????? ?????? ??????
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
        // ????????? ????????? ?????? ??????
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
        // ????????? ????????? ?????? ?????? ?????????
        [act.CLEAR_LIST_MENU_CONTENTS_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.listMenu.contents = initialState.listMenu.contents;
            });
        },
        // ????????? ?????? ??????
        [act.CHANGE_LIST_MENU_CONTENTS]: (state, { payload: { content } }) => {
            return produce(state, (draft) => {
                draft.listMenu.contents.info.content = content;
            });
        },
        // ????????? ?????? ?????? ??????
        [act.CHANGE_LIST_MENU_REPLY_CONTENTS]: (state, { payload: { content } }) => {
            return produce(state, (draft) => {
                draft.listMenu.contents.reply.content = content;
            });
        },
    },
    initialState,
);
