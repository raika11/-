import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './templateAction';
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
            relSeqType: 'TP',
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
            relSeqType: 'TP',
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
            relSeqType: 'TP',
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
            relSeqType: 'TP',
        },
    },
};

export default handleActions(
    {
        /**
         * 검색조건 변경
         */
        [act.CHANGE_SEARCH_REL_OPTION]: (state, { payload: { relType, key, value } }) => {
            return produce(state, (draft) => {
                if (draft[relType]) {
                    draft[relType].search[key] = value;
                }
            });
        },
        [act.CHANGE_SEARCH_REL_OPTIONS]: (state, { payload: { relType, changes } }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < changes.length; idx++) {
                    let obj = changes[idx];
                    if (draft[relType]) {
                        draft[relType].search[obj.key] = obj.value;
                    }
                }
            });
        },
    },
    initialState,
);
