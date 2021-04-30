import { handleActions } from 'redux-actions';
import * as action from './abAction';
import produce from 'immer';

export const ABTEST_TYPE = {
    DIRECT_DESIGN: 'A',
    ALTERNATIVE_INPUT: 'E',
    JAM: 'J',
    NEWSLETTER: 'L',
};

/**
 * AB테스트 대상(TPLT:디자인,레터레이아웃 / DATA:데이터 / COMP:컴포넌트(메인탑디자인 및 본문외) / 레터제목:LTIT / 발송일시 / LSDT / 발송자명:LSNM)
 * @type {{DESIGN: string, DATA: string}}
 */
export const ABTEST_PURPOSE = {
    DESIGN: 'TPLT',
    DATA: 'DATA',
    COMPONENT: 'COMP',
    LETTER_TITLE: 'LTIT',
    LETTER_SEND_DATE: 'LSDT',
    LETTER_SENDER_NAME: 'LSNM',
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

        [action.CHANGE_SEARCH_OPTION]: (state, { payload }) => {
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

        [action.GET_AB_TEST_SUCCESS]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.ab = payload;
            });
        },
    },
    initialState,
);
