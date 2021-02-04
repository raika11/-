import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './commentAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    // common: {
    //     searchGroupId: [
    //         { id: 'A', name: '전체매체' },
    //         { id: 'B', name: '포탈' },
    //         { id: 'C', name: '일간' },
    //         { id: 'D', name: '중앙' },
    //         { id: 'E', name: '중앙데일리' },
    //         { id: 'F', name: '썰전' },
    //     ],
    //     searchStatusList: [
    //         { id: 'A', name: '정상' },
    //         { id: 'B', name: '사용자 삭제' },
    //         { id: 'C', name: '관리자 삭제' },
    //     ],
    //     searchOrderTypeList: [
    //         { id: 'A', name: '최신순' },
    //         { id: 'B', name: '신고순' },
    //     ],
    //     searchIdTypeList: [
    //         { id: 'A', name: '조인스' },
    //         { id: 'B', name: '카카오' },
    //         { id: 'C', name: '페이스북' },
    //         { id: 'D', name: '트위터' },
    //         { id: 'E', name: '미투데이' },
    //         { id: 'F', name: '요즘' },
    //         { id: 'G', name: '기타' },
    //     ],
    //     searchTypeList: [
    //         { id: 'name', name: '이름' },
    //         { id: 'id', name: 'ID' },
    //         { id: 'comment', name: '댓글 내용' },
    //     ],
    //     tagDiv: [
    //         { name: `광고`, value: `A` },
    //         { name: `비방`, value: `B` },
    //         { name: `욕설`, value: `C` },
    //         { name: `도배`, value: `B` },
    //         { name: `음란`, value: `D` },
    //         { name: `기타`, value: `E` },
    //     ],
    //     pageIsearchTypeGubun: [
    //         { name: `차단IP`, value: `A` },
    //         { name: `차단내용`, value: `B` },
    //         { name: `등록자ID`, value: `C` },
    //         { name: `등록자`, value: `B` },
    //     ],
    // },
    common: {
        COMMENT_MEDIA_CODE: [],
        COMMENT_ORDER_CODE: [],
        COMMENT_SITE_CODE: [],
        COMMENT_STATUS_CODE: [],
        COMMENT_TAG_DIV_CODE: [],
    },
    comments: {
        total: 0,
        list: [],
        error: null,
        search: {
            sort: 'regDt,asc',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            searchType: '',
            keyword: '',
            domain: '',
            orderType: 'A',
            status: 'A',
            startDt: '',
            endDt: '',
            memType: '',
            groupId: '',
            contentId: '',
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
            },
            total: 0,
            list: [],
            error: null,
        },
    },
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
                draft.comments.search = newSearch;
            });
        },
        // 차단 관리 검색 옵션.
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
        // banned 메뉴 구분값
        [act.INITIALIZE_BANNED_PARAMS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.banneds.pagePathName = payload.pagePathName;
                draft.banneds.pageGubun = payload.pageGubun;
                draft.banneds.pageName = payload.pageName;
            });
        },
        /**
         * 스토어 데이터 초기화
         */
        [act.CLEAR_STORE]: () => initialState,
        // 공통 구분값 처리.
        [act.GET_INIT_DATA_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.common = payload;
            });
        },
        // 댓글 목록 초기화.
        [act.CLEAR_LIST]: (state) => {
            return produce(state, (draft) => {
                draft.comments.total = initialState.comments.total;
                draft.comments.list = initialState.comments.list;
                draft.error = initialState.error;
            });
        },
        [act.CLEAR_SEARCH]: (state) => {
            return produce(state, (draft) => {
                draft.comments.search = initialState.search;
            });
        },
        /**
         * 목록
         */
        [act.GET_COMMENT_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                // draft.error = initialState.error;
                draft.comments.list = body.list;
                draft.comments.total = body.totalCnt;
            });
        },
        [act.GET_COMMENT_LIST_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                // draft.error = payload;
                draft.comments.list = initialState.comments.list;
                draft.comments.total = initialState.comments.total;
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

        [act.GET_COMMENTS_BLOCKS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.banneds.commentsBlocks.list = body.list;
                draft.banneds.commentsBlocks.total = body.totalCnt;
            });
        },
    },
    initialState,
);
