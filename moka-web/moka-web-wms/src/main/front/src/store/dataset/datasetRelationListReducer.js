import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './datasetAction';
import { PAGESIZE_OPTIONS } from '@/constants';

export const initialState = {
    PG: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'pageSeq,desc',
            domainId: null,
            templateSeq: null,
            relType: 'PG',
            relSeqType: 'DS',
        },
    },
    CT: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'containerSeq,desc',
            domainId: null,
            templateSeq: null,
            relType: 'CT',
            relSeqType: 'DS',
        },
    },
    CP: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'componentSeq,desc',
            domainId: null,
            templateSeq: null,
            relType: 'CP',
            relSeqType: 'DS',
        },
    },
    SK: {
        total: 0,
        error: null,
        list: [],
        search: {
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            sort: 'skinSeq,desc',
            domainId: null,
            templateSeq: null,
            relType: 'SK',
            relSeqType: 'DS',
        },
    },
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_PG_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.PG.search = payload;
            });
        },
        [act.CHANGE_SEARCH_SK_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.SK.search = payload;
            });
        },
        [act.CHANGE_SEARCH_CT_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.CT.search = payload;
            });
        },
        [act.CHANGE_SEARCH_CP_OPTION]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.CP.search = payload;
            });
        },
        /**
         * 관련아이템 목록
         */
        [act.GET_RELATION_LIST_SUCCESS]: (state, { payload: { relType, body } }) => {
            return produce(state, (draft) => {
                draft[relType].list = body.list;
                draft[relType].total = body.totalCnt;
                draft[relType].error = initialState[relType].error;
            });
        },
        [act.GET_RELATION_LIST_FAILURE]: (state, { payload: { relType, payload } }) => {
            return produce(state, (draft) => {
                draft[relType].list = initialState[relType].list;
                draft[relType].total = initialState[relType].total;
                draft[relType].error = payload;
            });
        },
        /**
         * 스토어 데이터 제거
         */
        [act.CLEAR_RELATION_LIST]: () => initialState,
    },
    initialState,
);
