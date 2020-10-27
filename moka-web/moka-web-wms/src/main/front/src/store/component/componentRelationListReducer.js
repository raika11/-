import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './componentAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
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
            relSeqType: 'CP',
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
            relSeqType: 'CP',
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
            relSeqType: 'CP',
        },
    },
};

export default handleActions(
    {
        [act.CLEAR_RELATION_LIST]: () => initialState,
    },
    initialState,
);
