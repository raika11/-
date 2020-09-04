import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'adStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'adStore/CHANGE_SEARCH_OPTIONS';
export const CLEAR_SEARCH_OPTION = 'adStore/CLEAR_SEARCH_OPTION';
export const CLEAR_AD = 'adStore/CLEAR_AD';
export const [GET_ADS, GET_ADS_SUCCESS, GET_ADS_FAILURE] = createRequestActionTypes(
    'adStore/GET_ADS'
);

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (payload) => payload);
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const clearAd = createAction(CLEAR_AD, (payload) => payload);
export const getAds = createAction(GET_ADS, (...actions) => actions);

/**
 * initialState
 */
export const initialState = {
    total: 0,
    list: [],
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'adSeq,desc',
        domainId: undefined,
        keyword: undefined,
        searchType: 'all'
    },
    error: undefined
};

/**
 * reducer
 */
const adStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CHANGE_SEARCH_OPTIONS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.search[obj.key] = obj.value;
                }
            });
        },
        [CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        /**
         * 목록 조회 결과
         */
        [GET_ADS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_ADS_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.error = payload;
                draft.list = initialState.list;
                draft.total = initialState.total;
            });
        },
        [CLEAR_AD]: () => initialState
    },
    initialState
);

export default adStore;
