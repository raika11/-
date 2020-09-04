import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_EDIT_ALL = 'etccodeStore/CHANGE_EDIT_ALL';
export const CHANGE_EDITS = 'etccodeStore/CHANGE_EDITS';

export const CHANGE_SEARCH_OPTION = 'etccodeStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'etccodeStore/CHANGE_SEARCH_OPTIONS';

// action : 코드 목록 조회
export const [
    GET_ETCCODE_LIST,
    GET_ETCCODE_LIST_SUCCESS,
    GET_ETCCODE_LIST_FAILURE
] = createRequestActionTypes('etccodeStore/GET_ETCCODE_LIST');

// action : 코드 수정
export const [PUT_ETCCODE, PUT_ETCCODE_SUCCESS, PUT_ETCCODE_FAILURE] = createRequestActionTypes(
    'etccodeStore/PUT_ETCCODE'
);

// action : 코드 삭제
export const [
    DELETE_ETCCODE,
    DELETE_ETCCODE_SUCCESS,
    DELETE_ETCCODE_FAILURE
] = createRequestActionTypes('etccodeStore/DELETE_ETCCODE');

/**
 * action creator
 */
export const changeEditAll = createAction(CHANGE_EDIT_ALL, (payload) => payload);
export const changeEdits = createAction(CHANGE_EDITS, (payload) => payload);

export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);

// action creator : 코드 목록 조회
export const getEtccodeList = createAction(GET_ETCCODE_LIST, (codeTypeId) => codeTypeId);

// action creator : 코드 수정
export const putEtccode = createAction(PUT_ETCCODE, (payload) => payload);

// action creator : 코드 삭제
export const deleteEtccode = createAction(DELETE_ETCCODE, (payload) => payload);

/**
 * initialState
 */
const initialState = {
    // 코드 목록
    etccodes: null,
    etccodesError: null,
    total: 0,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'codeOrder,desc',
        searchType: '',
        keyword: ''
    }
};

/**
 * reducer
 */
const etccodeStore = handleActions(
    {
        [CHANGE_EDITS]: (state, { payload: arr }) => {
            return produce(state, (draft) => {
                for (let idx = 0; idx < arr.length; idx++) {
                    let obj = arr[idx];
                    draft.edit[obj.key] = obj.value;
                }
            });
        },
        [CHANGE_EDIT_ALL]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.edit = payload;
            });
        },

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

        // 목록 조회 성공
        [GET_ETCCODE_LIST_SUCCESS]: (state, { payload: { body } }) => {
            return {
                ...state,
                etccodes: body && body.list,
                total: body && body.totalCnt,
                etccodesError: null
            };
        },

        // 목록 조회 실패
        [GET_ETCCODE_LIST_FAILURE]: (state, { payload: etccodesError }) => {
            return {
                ...state,
                etccodesError,
                etccodes: null
            };
        },
        // 코드 수정 성공
        [PUT_ETCCODE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.etccodesError = null;
                draft.etccodes = body && body.list;
                draft.total = body && body.totalCnt;
            });
        },
        // 코드 수정 실패
        [PUT_ETCCODE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.etccodesError = payload;
                draft.etccodes = initialState.list;
            });
        },
        // 코드 삭제 성공
        [DELETE_ETCCODE_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.detailError = undefined;
                draft.detail = initialState.detail;
            });
        },
        // 코드 삭제 실패
        [DELETE_ETCCODE_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.detailError = payload;
            });
        }
    },
    initialState
);

export default etccodeStore;
