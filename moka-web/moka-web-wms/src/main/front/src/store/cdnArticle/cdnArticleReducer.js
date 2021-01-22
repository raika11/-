import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './cdnArticleAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: null,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        searchType: 'all',
        keyword: '',
    },
    searchTypeList: [
        { id: 'all', name: '전체' },
        { id: 'totalId', name: '기사ID' },
        { id: 'title', name: '제목' },
    ],
    cdnArticle: {},
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
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_CDN_ARTICLE]: (state) => {
            return produce(state, (draft) => {
                draft.cdnArticle = initialState.cdnArticle;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 조회
         */
        [act.GET_CDN_ARTICLE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.total = body.totalCnt;
                draft.list = body.list;
                draft.error = initialState.error;
            });
        },
        [act.GET_CDN_ARTICLE_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = initialState.totalCnt;
                draft.list = initialState.list;
                draft.error = payload;
            });
        },
        [act.GET_CDN_ARTICLE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.article = body;
                draft.invalidList = initialState.invalidList;
            });
        },
        [act.GET_CDN_ARTICLE_FAILURE]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.invalidList = body.list;
            });
        },
    },
    initialState,
);
