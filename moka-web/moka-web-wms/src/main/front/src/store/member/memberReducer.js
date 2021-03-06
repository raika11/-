import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from '@store/member/memberAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    list: [],
    error: null,
    search: {
        searchType: 'all',
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'regDt,desc',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'memberId', name: 'ID' },
        { id: 'memberNm', name: '이름' },
    ],
    member: {},
    menuAuthInfo: {
        list: [],
        editedOrg: [],
        edited: [],
        usedOrg: [],
        used: [],
        halfCheckedKeys: [],
    },
    memberError: {},
    invalidList: [],
    historySearch: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
    },
    historyList: [],
    historyTotal: 0,
    historyError: {},
};

/**
 * reducer
 */
export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.search = newSearch;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_MEMBER]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.member = payload;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 스토어 데이터 삭제
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_MEMBER]: (state) => {
            return produce(state, (draft) => {
                draft.member = initialState.member;
                draft.memberError = initialState.memberError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_LOGIN_HISTORY_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.hisTorytotal = initialState.hisTorytotal;
                draft.historyList = initialState.historyList;
                draft.historyError = initialState.historyError;
            });
        },
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.total = initialState.total;
                draft.list = initialState.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        [act.CLEAR_LOGIN_HISTORY_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.historySearch = initialState.historySearch;
            });
        },
        /**
         * 목록
         */
        [act.GET_MEMBER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_MEMBER_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        /**
         * 조회, 등록, 수정
         */
        [act.GET_MEMBER_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.member = body;
                draft.memberError = initialState.memberError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_MEMBER_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.memberError = payload;
                draft.invalidList = payload.body.list;
            });
        },
        /**
         * 로그인 이력 검색조건 변경
         */
        [act.CHANGE_HISTORY_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.historySearch = newSearch;
            });
        },
        /**
         * 로그인 이력 조회
         */
        [act.GET_LOGIN_HISTORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.historyError = initialState.historyError;
                draft.historyList = body.list;
                draft.historyTotal = body.totalCnt;
            });
        },
        [act.GET_LOGIN_HISTORY_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.historyError = payload;
                draft.historyList = initialState.list;
                draft.historyTotal = initialState.historyTotal;
            });
        },

        /**
         * 메뉴 권한
         */
        [act.GET_MEMBER_MENU_AUTH_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.menuAuthInfo = { ...state.menuAuthInfo, ...payload };
            });
        },

        /**
         * 메뉴 권한 수정
         */
        [act.CHANGE_MEMBER_MENU_AUTH]: (state, { payload }) => {
            return produce(state, (draft) => {
                const name = payload.name;
                const value = payload.value;
                draft.menuAuthInfo[name] = value;
            });
        },

        /**
         * 메뉴 권한 초기화
         */
        [act.CLEAR_MEMBER_MENU_AUTH]: (state) => {
            return produce(state, (draft) => {
                draft.menuAuthInfo = initialState.menuAuthInfo;
            });
        },
    },
    initialState,
);
