import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'templateRelationCSStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'templateRelationCSStore/CHANGE_SEARCH_OPTIONS';
export const [
    GET_RELATIONS,
    GET_RELATIONS_SUCCESS,
    GET_RELATIONS_FAILURE
] = createRequestActionTypes('templateRelationCSStore/GET_RELATIONS');
export const CLEAR_RELATIONS = 'templateRelationCSStore/CLEAR_RELATIONS';

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const getRelations = createAction(GET_RELATIONS, (payload) => ({
    relType: 'CS',
    actions: payload
}));
export const clearRelations = createAction(CLEAR_RELATIONS);

/**
 * initial state
 */
const initialState = {
    total: 0,
    error: undefined,
    search: {
        page: 0,
        size: PAGESIZE_OPTIONS[0],
        sort: 'skinSeq,desc',
        domainId: undefined,
        templateSeq: undefined,
        relType: 'CS',
        relSeqType: 'TP'
    },
    list: []
};

/**
 * reducer
 */
const templateRelationCSStore = handleActions(
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
        /**
         * 템플릿 -> 관련 스킨 조회
         */
        [GET_RELATIONS_SUCCESS]: (state, { payload: { body } }) => {
            return produce(state, (draft) => {
                draft.error = undefined;
                draft.list = body.list;
                draft.total = body.totalCnt;
            });
        },
        [GET_RELATIONS_FAILURE]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = payload;
            });
        },
        [CLEAR_RELATIONS]: (state) => {
            return produce(state, (draft) => {
                draft.list = initialState.list;
                draft.total = initialState.total;
                draft.error = initialState.error;
            });
        }
    },
    initialState
);

export default templateRelationCSStore;
