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
            { key: 'D', value: '서비스 종료' },
        ],
    },
    search: {
        page: 0,
        size: 20,
        searchType: '',
        keyword: '',
        pollDiv: '',
        pollType: '',
        startDt: '',
        endDt: '',
        status: '',
    },
    list: [],
};

export default handleActions(
    {
        [action.GET_POLL_LIST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
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
