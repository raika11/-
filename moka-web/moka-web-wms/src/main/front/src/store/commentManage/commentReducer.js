import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './commentAction';
import { PAGESIZE_OPTIONS } from '@/constants';
import moment from 'moment';

/**
 * initialState
 */
export const initialState = {
    common: {
        // COMMENT_MEDIA_CODE: [],
        // COMMENT_ORDER_CODE: [],
        // COMMENT_SITE_CODE: [],
        // COMMENT_STATUS_CODE: [],
        // COMMENT_TAG_DIV_CODE: [],
    },
    comments: {
        total: 0,
        list: [],
        error: null,
        search: {
            sort: 'regDt,asc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: 'memNm',
            keyword: '',
            domain: '',
            orderType: 'A',
            status: 'Y',
            startDt: moment().format('YYYY-MM-DD'),
            endDt: moment().format('YYYY-MM-DD'),
            memType: '',
            groupId: '',
        },
    },
    banneds: {
        pagePathName: '',
        pageGubun: '',
        pageName: '',
        commentsBlocks: {
            search: {
                page: 0,
                size: PAGESIZE_OPTIONS[0],
                sort: 'seqNo,desc',
                searchType: '',
                keyword: '',
                tagType: '',
                tagDiv: '',
                media: '',
            },
            total: 0,
            list: [],
            error: null,
        },
    },
    block: {},
    blockUsed: {
        state: false,
        seqNo: null,
    },
    blockHistory: {
        total: 0,
        list: [],
    },
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
                draft.comments.search = newSearch;
            });
        },
        /**
         * 차단 관리 검색 옵션.
         */
        [act.CHANGE_BANNEDS_SEARCH_OPTION]: (state, { payload: newSearch }) => {
            return produce(state, (draft) => {
                draft.banneds.commentsBlocks.search = newSearch;
            });
        },
        /**
         * 데이터 변경
         */
        [act.CHANGE_COMMENT]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.comments = payload;
            });
        },
        [act.CLEAR_COMMENT]: (state) => {
            return produce(state, (draft) => {
                draft.comments = initialState.comments;
            });
        },
        [act.CHANGE_INVALID_LIST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.invalidList = payload;
            });
        },
        /**
         * 댓글 화면 초기 설정 정보 조회
         */
        [act.GET_INIT_DATA_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.common = body;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.comments.list = initialState.comments.list;
                draft.comments.total = initialState.comments.total;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.comments.search = initialState.search;
            });
        },
        [act.CLEAR_BLOCK_HISTORY]: (state) => {
            return produce(state, (draft) => {
                draft.blockHistory = initialState.blockHistory;
            });
        },
        [act.CLEAR_BLOCKS_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.banneds.commentsBlocks.list = initialState.banneds.commentsBlocks.list;
            });
        },
        /**
         * 차단 메뉴 구분값
         */
        [act.INITIALIZE_BANNED_PARAMS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.banneds.pagePathName = payload.pagePathName;
                draft.banneds.pageGubun = payload.pageGubun;
                draft.banneds.pageName = payload.pageName;
            });
        },
        /**
         * 목록
         */
        [act.GET_COMMENT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.comments.list = body.list;
                draft.comments.total = body.totalCnt;
                draft.comments.error = initialState.error;
            });
        },
        [act.GET_COMMENT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.comments.list = initialState.comments.list;
                draft.comments.total = initialState.comments.total;
                draft.comments.error = payload;
            });
        },
        [act.GET_COMMENTS_BLOCKS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.banneds.commentsBlocks.list = body.list;
                draft.banneds.commentsBlocks.total = body.totalCnt;
            });
        },
        [act.GET_COMMENTS_BLOCKS_FAILURE]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.banneds.commentsBlocks.list = initialState.banneds.commentsBlocks.list;
                draft.banneds.commentsBlocks.total = initialState.banneds.commentsBlocks.total;
            });
        },
        /**
         * 삭제
         */
        [act.DELETE_COMMENT_SUCCESS]: (state) => {
            return produce(state, (draft) => {
                // draft.comment = initialState.comment;
                // draft.commentError = initialState.commentError;
            });
        },
        [act.DELETE_COMMENT_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.commentError = payload;
            });
        },
        /**
         * 조회
         */
        [act.GET_BLOCK_HISTORY_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.blockHistory.list = body.list;
                draft.blockHistory.total = body.totalCnt;
            });
        },
    },
    initialState,
);
