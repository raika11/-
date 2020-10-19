import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as act from './templateAction';
import { PAGESIZE_OPTIONS } from '@/constants';

/**
 * initialState
 */
export const initialState = {
    total: 0,
    error: undefined,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'templateSeq,desc',
        widthMin: undefined,
        widthMax: undefined,
        domainId: 'all',
        tpZone: 'all',
        tpSize: 'all',
        searchType: 'all',
        keyword: '',
    },
    templateBody: '',
};

export default handleActions(
    {
        [act.CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [act.CHANGE_SEARCH_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.search[obj.key] = obj.value;
                }
            });
        },
        [act.CLEAR_TEMPLATE]: () => initialState,
    },
    initialState,
);
