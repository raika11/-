import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './directLinkAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        usedYn: 'Y',
        fixYn: 'Y',
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'title', name: '제목' },
        { id: 'content', name: '내용' },
        { id: 'keyword', name: '키워드' },
    ],
    directLink: {
        viewSDate: null,
        viewEDate: null,
        usedYn: 'Y',
        fixYn: 'Y',
        linkType: 'N',
    },
    directLinkError: null,
    invalidList: [],
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_DIRECT_LINK]: (state) => {
            return produce(state, (draft) => {
                draft.directLink = initialState.directLink;
                draft.directLinkError = initialState.directLinkError;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_DIRECT_LINK]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.directLink = payload;
            });
        },
        [act.CHANGE_INVALID_LINK]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_DIRECT_LINK_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        [act.GET_DIRECT_LINK_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        [act.GET_DIRECT_LINK_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.directLink = body;
                draft.directLinkError = initialState.directLinkError;
            });
        },
        [act.GET_DIRECT_LINK_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.directLinkError = payload;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_DIRECT_LINK_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.directLink = initialState.directLink;
                draft.directLinkError = initialState.directLinkError;
            });
        },
        [act.DELETE_DIRECT_LINK_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.directLinkError = payload;
            });
        },
    },
    initialState,
);
