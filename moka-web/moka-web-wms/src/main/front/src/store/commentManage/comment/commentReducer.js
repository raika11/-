import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './commentAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    list: [],
    error: null,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'regDt,asc',
    },
    searchMediaList: [
        { id: 'all', name: '전체매체' },
        { id: '', name: '포탈' },
        { id: '', name: '일간' },
        { id: '', name: '중앙' },
        { id: '', name: '중앙데일리' },
        { id: '', name: '썰전' },
    ],
    searchStatusList: [
        { id: '', name: '정상' },
        { id: '', name: '사용자 삭제' },
        { id: '', name: '관리자 삭제' },
    ],
    searchOrderList: [
        { id: 'desc', name: '최신순' },
        { id: '', name: '신고순' },
    ],
    searchIdTypeList: [
        { id: 'all', name: '전체계정' },
        { id: '', name: '조인스' },
        { id: '', name: '카카오' },
        { id: '', name: '페이스북' },
        { id: '', name: '트위터' },
        { id: '', name: '미투데이' },
        { id: '', name: '요즘' },
        { id: '', name: '기타' },
    ],
    searchTypeList: [
        { id: 'name', name: '이름' },
        { id: 'comment', name: '댓글 내용' },
    ],
    block: {},
    blockError: {},
    invalidList: {},
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
        [act.CHANGE_COMMENT]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.comment = payload;
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
        /**
         * 목록
         */
        [act.GET_COMMENT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = initialState.error;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [act.GET_COMMENT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },

        /**
         * 삭제
         */
        [act.DELETE_COMMENT_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                draft.comment = initialState.comment;
                draft.commentError = initialState.commentError;
            });
        },
        [act.DELETE_COMMENT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.commentError = payload;
            });
        },
    },
    initialState,
);
