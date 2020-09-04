import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'codeStore/CHANGE_SEARCH_OPTION';
export const CLEAR_SEARCH_OPTION = 'codeStore/CLEAR_SEARCH_OPTION';
export const CLEAR_CODE = 'codeStore/CLEAR_CODE';
export const [
    GET_LARGE_CODES,
    GET_LARGE_CODES_SUCCESS,
    GET_LARGE_CODES_FAILURE
] = createRequestActionTypes('codeStore/GET_LARGE_CODES');
export const [
    GET_MIDDLE_CODES,
    GET_MIDDLE_CODES_SUCCESS,
    GET_MIDDLE_CODES_FAILURE
] = createRequestActionTypes('codeStore/GET_MIDDLE_CODES');
export const [
    GET_SMALL_CODES,
    GET_SMALL_CODES_SUCCESS,
    GET_SMALL_CODES_FAILURE
] = createRequestActionTypes('codeStore/GET_SMALL_CODES');
export const [GET_CODES, GET_CODES_SUCCESS, GET_CODES_FAILURE] = createRequestActionTypes(
    'codeStore/GET_CODES'
);

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const clearSearchOption = createAction(CLEAR_SEARCH_OPTION);
export const clearCode = createAction(CLEAR_CODE);
export const getLargeCodes = createAction(GET_LARGE_CODES);
export const getMiddleCodes = createAction(GET_MIDDLE_CODES, (...actions) => actions);
export const getSmallCodes = createAction(GET_SMALL_CODES, (...actions) => actions);
export const getCodes = createAction(GET_CODES, (...actions) => actions);

/**
 * initialState
 */
const initialState = {
    largeCodes: [],
    middleCodes: [],
    smallCodes: [],
    search: {
        largeCodeId: undefined,
        middleCodeId: undefined,
        smallCodeId: undefined,
        codeLevel: 2
    },
    codes: []
};

/**
 * reducer
 */
const codeStore = handleActions(
    {
        [CHANGE_SEARCH_OPTION]: (state, { payload: { key, value } }) => {
            return produce(state, (draft) => {
                draft.search[key] = value;
            });
        },
        [CLEAR_SEARCH_OPTION]: (state) => {
            return produce(state, (draft) => {
                draft.search = initialState.search;
            });
        },
        [CLEAR_CODE]: (state) => {
            return produce(state, (draft) => {
                draft.largeCodes = initialState.largeCodes;
                draft.middleCodes = initialState.middleCodes;
                draft.smallCodes = initialState.smallCodes;
                draft.codes = initialState.codes;
            });
        },
        /**
         * 대분류 조회 결과
         */
        [GET_LARGE_CODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.largeCodes = body.list;
            });
        },
        [GET_LARGE_CODES_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.largeCodes = initialState.largeCodes;
            });
        },
        /**
         * 중분류 조회 결과
         */
        [GET_MIDDLE_CODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.middleCodes = body.list;
            });
        },
        [GET_MIDDLE_CODES_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.middleCodes = initialState.middleCodes;
            });
        },
        /**
         * 소분류 조회 결과
         */
        [GET_SMALL_CODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.smallCodes = body.list;
            });
        },
        [GET_SMALL_CODES_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.smallCodes = initialState.smallCodes;
            });
        },
        /**
         *  모든분류 조회 결과
         */
        [GET_CODES_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.codes = body.list;
            });
        },
        [GET_CODES_FAILURE]: (state) => {
            return produce(state, (draft) => {
                draft.codes = initialState.codes;
            });
        }
    },
    initialState
);

export default codeStore;
