import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 * 기본 리스트 + 관련탭에서 사용하는 lookup 리스트
 */
export const CHANGE_SEARCH_OPTION = 'component/CHANGE_SEARCH_OPTION';
export const CHANGE_LOOKUP_SEARCH_OPTION = 'component/CHANGE_REF_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeLookupSearchOption = createAction(CHANGE_LOOKUP_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'component/CLEAR_STORE';
export const CLEAR_COMPONENT = 'component/CLEAR_COMPONENT';
export const CLEAR_LIST = 'component/CLEAR_LIST';
export const CLEAR_SEARCH = 'component/CLEAR_SEARCH';
export const CLEAR_LOOKUP = 'component/CLEAR_LOOKUP';
export const clearStore = createAction(CLEAR_STORE);
export const clearComponent = createAction(CLEAR_COMPONENT);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearLookup = createAction(CLEAR_LOOKUP);

/**
 * 데이터 조회
 */
export const [GET_COMPONENT_LIST, GET_COMPONENT_LIST_SUCCESS, GET_COMPONENT_LIST_FAILURE] = createRequestActionTypes('component/GET_COMPONENT_LIST');
export const [GET_COMPONENT, GET_COMPONENT_SUCCESS, GET_COMPONENT_FAILURE] = createRequestActionTypes('component/GET_COMPONENT');
export const getComponentList = createAction(GET_COMPONENT_LIST, (...actions) => actions);
export const getComponent = createAction(GET_COMPONENT, ({ componentSeq }) => ({ componentSeq }));
export const [GET_COMPONENT_LOOKUP_LIST, GET_COMPONENT_LOOKUP_LIST_SUCCESS, GET_COMPONENT_LOOKUP_LIST_FAILURE] = createRequestActionTypes('component/GET_COMPONENT_LOOKUP_LIST');
export const getComponentLookupList = createAction(GET_COMPONENT_LOOKUP_LIST, (...actions) => actions);

/**
 * 모달 데이터 조회
 */
export const GET_COMPONENT_LIST_MODAL = 'component/GET_COMPONENT_LIST_MODAL';
export const getComponentListModal = createAction(GET_COMPONENT_LIST_MODAL, ({ search, callback }) => ({ search, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_COMPONENT = 'component/CHANGE_COMPONENT';
export const CHANGE_INVALID_LIST = 'component/CHANGE_INVALID_LIST';
export const changeComponent = createAction(CHANGE_COMPONENT, (component) => component);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_COMPONENT = 'component/SAVE_COMPONENT';
export const SAVE_COMPONENT_LIST = 'component/SAVE_COMPONENT_LIST';
export const saveComponent = createAction(SAVE_COMPONENT, ({ actions, callback }) => ({ actions, callback }));
export const saveComponentList = createAction(SAVE_COMPONENT_LIST, (componentList) => componentList);

/**
 * 복사
 */
export const COPY_COMPONENT = 'component/COPY_COMPONENT';
export const copyComponent = createAction(COPY_COMPONENT, ({ componentSeq, componentName, callback }) => ({ componentSeq, componentName, callback }));

/**
 * 삭제
 */
export const [DELETE_COMPONENT, DELETE_COMPONENT_SUCCESS] = createRequestActionTypes('component/DELETE_COMPONENT');
export const deleteComponent = createAction(DELETE_COMPONENT, ({ componentSeq, callback }) => ({ componentSeq, callback }));

/**
 * 관련아이템있는지 확인
 */
export const HAS_RELATION_LIST = 'component/HAS_RELATION_LIST';
export const hasRelationList = createAction(HAS_RELATION_LIST, ({ componentSeq, callback }) => ({ componentSeq, callback }));
