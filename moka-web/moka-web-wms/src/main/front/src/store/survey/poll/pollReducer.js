import { handleActions } from 'redux-actions';
import * as action from '@store/survey/poll/pollAction';
import produce from 'immer';

export const initialState = {
    poll: {
        group: '',
        servcode: '1',
        graphType: 'W',
        type: 'M',
        sdate: null,
        edate: null,
        status: 'T',
        loginFlag: 'Y',
        repetitionFlag: 'Y',
        bbsFlag: 'Y',
        bbsUrl: '',
        commentFlag: 'Y',
        itemCount: 2,
        itemvalueLimit: 1,
        question: {
            title: '',
        },
    },
    codes: {
        category: [],
        group: [],
        status: [
            { key: 'S', value: '서비스 중' },
            { key: 'T', value: '일시 중지' },
        ],
    },
    search: {
        page: 0,
        size: 20,
        searchType: 'title',
        keyword: '',
        pollGroup: 'A',
        pollCategory: '',
        startDt: '',
        endDt: '',
        status: '',
    },
    total: 0,
    list: [],
};

export default handleActions(
    {
        [action.CHANGE_POLL_SEARCH_OPTIONS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.search = payload;
            });
        },
        [action.GET_POLL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.total = payload.data.body.totalCnt;
                draft.list = payload.data.body.list;
            });
        },
        [action.GET_POLL_CATEGORY_CODES_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.codes.category = payload;
            });
        },
        [action.GET_POLL_GROUP_CODES_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.codes.group = payload;
            });
        },
    },
    initialState,
);
