import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './micAction';
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
        keyword: '',
        agndTop: 'Y',
    },
    agndTopList: [
        { id: 'all', name: '전체 메뉴' },
        { id: 'Y', name: '최상단' },
    ],
    agenda: {
        usedYn: 'N',
        agndTop: 'N',
        categoryList: [],
        relArticleList: [],
    },
    category: {
        list: [],
        search: {
            includeDel: 'Y', // 삭제된 것까지 검색 포함 여부 (Y/N)
        },
    },
    banner: {
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
        },
    },
    invalidList: [],
    answTotal: 0,
    agndTotal: 0,
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
        [act.CLEAR_MIC_AGENDA]: (state) => {
            return produce(state, (draft) => {
                draft.agenda = initialState.agenda;
            });
        },
        /**
         * 데이터 조회
         */
        [act.GET_MIC_AGENDA_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.list = body.list;
                draft.total = body.totalCnt;
                draft.error = initialState.error;
            });
        },
        /**
         * 아젠다 상세 조회
         */
        [act.GET_MIC_AGENDA_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.agenda = body;
                draft.invalidList = initialState.invalidList;
            });
        },
        /**
         * 아젠다, 전체 포스트 수
         */
        [act.GET_MIC_REPORT_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.answTotal = body.answTotal;
                draft.agndTotal = body.agndTotal;
            });
        },
        /**
         * 카테고리
         */
        [act.GET_MIC_CATEGORY_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.category.list = body.list;
            });
        },
    },
    initialState,
);
