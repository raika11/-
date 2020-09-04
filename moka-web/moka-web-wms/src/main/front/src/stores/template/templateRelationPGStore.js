import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { PAGESIZE_OPTIONS } from '~/constants';
import { createRequestActionTypes } from '~/stores/@common/createRequestSaga';

/**
 * action
 */
export const CHANGE_SEARCH_OPTION = 'templateRelationPGStore/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'templateRelationPGStore/CHANGE_SEARCH_OPTIONS';
export const [
    GET_RELATIONS,
    GET_RELATIONS_SUCCESS,
    GET_RELATIONS_FAILURE
] = createRequestActionTypes('templateRelationPGStore/GET_RELATIONS');
export const CLEAR_RELATIONS = 'templateRelationPGStore/CLEAR_RELATIONS';

/**
 * action creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({
    key,
    value
}));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);
export const getRelations = createAction(GET_RELATIONS, (payload) => ({
    relType: 'PG',
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
        sort: 'pageSeq,desc',
        domainId: undefined,
        templateSeq: undefined,
        relType: 'PG',
        relSeqType: 'TP'
    },
    list: []
};

/**
 * reducer
 */
const templateRelationPGStore = handleActions(
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
         * 템플릿 -> 관련 페이지 조회
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

export default templateRelationPGStore;
