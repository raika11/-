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
    GET_BOARD_CHANNEL_LIST_SUCCESS,
} from './boardsAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    pagePathName: '',
    gubun: '',
    boardType: '',
    channel_list: [],
    setmenu: {
        total: 0,
        list: [],
        search: {
            page: 0,
            sort: 'boardId,desc',
            size: PAGESIZE_OPTIONS[0],
            usedYn: 'Y',
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
            insLevel: null,
            viewLevel: null,
            answLevel: null,
            replyLevel: null,
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
        [GET_BOARD_CHANNEL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.channel_list = payload;
            });
        },

        // set 메뉴 검색 옵션 처리.
        [CHANGE_SETMENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setmenu.search = payload;
            });
        },
        [CLEAR_SETMENU_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.setmenu.search = initialState.setmenu.search;
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
        [CLEAR_SETMENU_BOARD_INFO]: (state) => {
            return produce(state, (draft) => {
                draft.setmenu.boardinfo = initialState.setmenu.boardinfo;
            });
        },

        [GET_GROUP_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.listmenu.groupList = body;
            });
        },
    },
    initialState,
);
