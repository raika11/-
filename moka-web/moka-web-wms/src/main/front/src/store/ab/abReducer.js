import { handleActions } from 'redux-actions';
import * as action from './abAction';
import produce from 'immer';

export const ABTEST_TYPE = {
    DIRECT_DESIGN: 'A',
    ALTERNATIVE_INPUT: 'E',
    JAM: 'J',
    NEWSLETTER: 'L',
};

export const ABTEST_PURPOSE = {
    DESIGN: 'T',
    DATA: 'D',
};

export const initialState = {
    list: [],
    total: 0,
    search: {
        page: 0,
        size: 20,
        useTotal: 'Y',
        abtestType: '',
        status: '',
        abtestPurpose: '',
    },
    ab: {},
    searchArea: [],
};

export default handleActions(
    {
        [action.CLEAR_STORE]: () => initialState,

        [action.CLEAR_AB_TEST]: (state) => {
            return produce(state, (draft) => {
                draft.ab = initialState.ab;
            });
        },

        [action.CHANGE_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },

        [action.GET_AB_TEST_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = payload.data.body.totalCnt;
                draft.list = payload.data.body.list;
            });
        },
    },
    initialState,
);
