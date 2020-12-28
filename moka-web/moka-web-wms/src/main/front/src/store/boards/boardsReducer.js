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
} from './boardsAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    pagePathName: '',
    gubun: '',
    boardType: '',
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
            boardName: '',
            boardType: '',
            usedYn: 'Y',
            titlePrefix1: '',
            titlePrefix2: '',
            insLevel: '0',
            viewLevel: '0',
            answLevel: '0',
            replyLevel: '0',
            editorYn: 'N',
            answYn: 'N',
            replyYn: 'N',
            fileYn: 'N',
            allowFileCnt: '',
            allowFileSize: '',
            allowFileExt: '',
            recomFlag: '0',
            declareYn: 'N',
            captchaYn: 'N',
            channelType: '',
            boardDesc: '',
            emailReceiveYn: 'N',
            receiveEmail: '',
            sendEmail: '',
            emailSendYn: 'N',
            exceptItem: '',
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
