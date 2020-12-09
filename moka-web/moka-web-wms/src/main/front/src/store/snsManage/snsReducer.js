import { DB_DATEFORMAT, PAGESIZE_OPTIONS } from '@/constants';
import { handleActions } from 'redux-actions';
import * as action from '@store/snsManage/snsAction';
import produce from 'immer';
import moment from 'moment';
const today = new Date();

export const initialState = {
    meta: {
        list: [],
        total: 0,
        search: {
            //startDt: moment(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)).format(DB_DATEFORMAT),
            //endDt: moment().format(DB_DATEFORMAT),
            startDt: moment(new Date(2020, 7, 21, 0, 0, 0)).format(DB_DATEFORMAT),
            endDt: moment(new Date(2020, 7, 21, 23, 59, 59)).format(DB_DATEFORMAT),
            searchType: 'artTitle',
            keyword: '',
            page: 0,
            size: PAGESIZE_OPTIONS[0],
            //sort: 'startDt,desc',
        },
    },
};

export default handleActions(
    {
        [action.GET_SNS_META_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.meta.list = body.list;
                draft.meta.total = body.totalCnt;
            });
        },
        [action.CHANGE_SNS_META_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.meta.search = payload;
            });
        },
    },

    initialState,
);
