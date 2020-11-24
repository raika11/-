import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './columnistAction';
import { PAGESIZE_OPTIONS } from '@/constants';
// ?page=0&searchType=all&sort=repSeq%2Casc&keyword=정중앙
export const initialState = {
    columnlist_list: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            status: 'Y',
            keyword: '',
        },
    },
    repoter_list: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            searchType: 'all',
            sort: 'repSeq,asc',
            keyword: '',
        },
    },
    columnist: {
        seqNo: '',
        repNo: '',
        // inout: null,
        status: 'Y', // FIXME: 2020-11-23 16:37 임시 Y
        repSeq: '',
        columnistNm: '',
        email: '',
        email1: '',
        email2: '',
        position: '',
        profile_photo: '',
        profile: '',
        selectImg: '',
    },
    columnistError: null,
    invalidList: [],
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_REPOTER_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.repoter_list.search = payload;
            });
        },
        [act.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnlist_list.search = payload;
            });
        },
        [act.CLEAR_SEARCH_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnlist_list.search = initialState.columnlist_list.search;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_COLUMNIST_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.columnlist_list = initialState.columnlist_list;
                draft.columnlistError = initialState.columnistError;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.CLEAR_REPORTER_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.repoter_list = initialState.repoter_list;
            });
        },
        /**
         * 스토어 데이터 변경.
         */
        [act.CHANGE_COLUMNIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnist = payload;
            });
        },
        [act.CHANGE_INVALID_LINK]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 리스트 데이터 조회
         */
        [act.GET_COLUMNIST_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.columnlist_list.error = initialState.error;
                draft.columnlist_list.list = body.list;
                draft.columnlist_list.total = body.totalCnt;
            });
        },
        [act.GET_COLUMNIST_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnlist_list.error = payload;
                draft.columnlist_list.list = initialState.columnlist_list.list;
                draft.columnlist_list.total = initialState.columnlist_list.total;
            });
        },
        /**
         * 정보 조회
         */
        [act.GET_COLUMNIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.columnlist = body;
                draft.columnistError = initialState.directLinkError;
            });
        },
        [act.GET_COLUMNIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.columnistError = payload;
            });
        },
        /**
         * 기자 검색 데이터 조회
         */
        [act.GET_REPOTER_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.repoter_list.list = body.list;
                draft.repoter_list.total = body.totalCnt;
                draft.repoter_list.error = initialState.error;
            });
        },
        [act.GET_REPOTER_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.repoter_list.list = initialState.repoter_list.list;
                draft.repoter_list.total = initialState.repoter_list.total;
                draft.repoter_list.error = payload;
            });
        },
    },
    initialState,
);
