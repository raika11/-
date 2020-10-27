import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'component/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'component/CLEAR_STORE';
export const CLEAR_COMPONENT = 'component/CLEAR_COMPONENT';
export const CLEAR_LIST = 'component/CLEAR_LIST';
export const CLEAR_SEARCH = 'component/CLEAR_SEARCH';
export const CLEAR_RELATION_LIST = 'component/CLEAR_RELATION_LIST';
export const clearStore = createAction(CLEAR_STORE);
export const clearComponent = createAction(CLEAR_COMPONENT);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearRelationList = createAction(CLEAR_RELATION_LIST);

/**
 * 데이터 조회
 */
export const [GET_COMPONENT_LIST, GET_COMPONENT_LIST_SUCCESS, GET_COMPONENT_LIST_FAILURE] = createRequestActionTypes('component/GET_COMPONENT_LIST');
export const [GET_COMPONENT, GET_COMPONENT_SUCCESS, GET_COMPONENT_FAILURE] = createRequestActionTypes('component/GET_COMPONENT');
export const getComponentList = createAction(GET_COMPONENT_LIST, (...actions) => actions);
export const getComponent = createAction(GET_COMPONENT, (componentSeq) => componentSeq);

/**
 * 데이터 변경
 */
export const CHANGE_COMPONENT = 'component/CHANGE_COMPONENT';
export const CHANGE_INVALID_LIST = 'domain/CHANGE_INVALID_LIST';
export const changeComponent = createAction(CHANGE_COMPONENT, (component) => component);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_COMPONENT = 'component/SAVE_COMPONENT';
export const SAVE_COMPONENT_LIST = 'component/SAVE_COMPONENT_LIST';
export const saveComponent = createAction(SAVE_COMPONENT, ({ actions, callback }) => ({ actions, callback }));
export const saveComponentList = createAction(SAVE_COMPONENT_LIST, (payload) => payload);

/**
 * 삭제
 */
export const [DELETE_COMPONENT, DELETE_COMPONENT_SUCCESS] = createRequestActionTypes('component/DELETE_COMPONENT');
export const deleteComponent = createAction(DELETE_COMPONENT, ({ componentSeq, callback }) => ({ componentSeq, callback }));

/**
 * 관련아이템 검색조건 변경
 */
export const CHANGE_SEARCH_PG_OPTION = 'component/CHANGE_SEARCH_PG_OPTION';
export const CHANGE_SEARCH_SK_OPTION = 'component/CHANGE_SEARCH_SK_OPTION';
export const CHANGE_SEARCH_CT_OPTION = 'component/CHANGE_SEARCH_CT_OPTION';
export const CHANGE_SEARCH_CP_OPTION = 'component/CHANGE_SEARCH_CP_OPTION';
export const changeSearchPGOption = createAction(CHANGE_SEARCH_PG_OPTION, (search) => search);
export const changeSearchSKOption = createAction(CHANGE_SEARCH_SK_OPTION, (search) => search);
export const changeSearchCTOption = createAction(CHANGE_SEARCH_CT_OPTION, (search) => search);
export const changeSearchCPOption = createAction(CHANGE_SEARCH_CP_OPTION, (search) => search);

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'component/HAS_RELATION_LIST';
export const [GET_RELATION_LIST, GET_RELATION_LIST_SUCCESS, GET_RELATION_LIST_FAILURE] = createRequestActionTypes('component/GET_RELATION_LIST');
export const hasRelationList = createAction(HAS_RELATION_LIST, (payload) => payload);
export const getRelationPGList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'PG',
}));
export const getRelationSKList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'SK',
}));
export const getRelationCTList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'CT',
}));
