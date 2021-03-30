import { handleActions } from 'redux-actions';
import produce from 'immer';
import * as action from '@store/issue/issueAction';
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
    },
    invalidList: [],
};

export default handleActions(
    {
        [action.GET_PACKAGE_LIST_SUCCESS]: (state) => {
            return produce(state, (draft) => {});
        },
    },
    initialState,
);
