import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 * 기본 리스트 + 관련탭에서 사용하는 lookup 리스트
 */
export const CHANGE_SEARCH_OPTION = 'container/CHANGE_SEARCH_OPTION';
export const CHANGE_LOOKUP_SEARCH_OPTION = 'container/CHANGE_REF_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeLookupSearchOption = createAction(CHANGE_LOOKUP_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'container/CLEAR_STORE';
export const CLEAR_CONTAINER = 'container/CLEAR_CONTAINER';
export const CLEAR_LIST = 'container/CLEAR_LIST';
export const CLEAR_SEARCH = 'container/CLEAR_SEARCH';
export const CLEAR_LOOKUP = 'container/CLEAR_LOOKUP';
export const clearStore = createAction(CLEAR_STORE);
export const clearContainer = createAction(CLEAR_CONTAINER);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearLookup = createAction(CLEAR_LOOKUP);

/**
 * 데이터 조회
 */
export const [GET_CONTAINER_LIST, GET_CONTAINER_LIST_SUCCESS, GET_CONTAINER_LIST_FAILURE] = createRequestActionTypes('container/GET_CONTAINER_LIST');
export const [GET_CONTAINER, GET_CONTAINER_SUCCESS, GET_CONTAINER_FAILURE] = createRequestActionTypes('container/GET_CONTAINER');
export const getContainerList = createAction(GET_CONTAINER_LIST, (...actions) => actions);
export const getContainer = createAction(GET_CONTAINER, ({ containerSeq }) => ({ containerSeq }));
export const [GET_CONTAINER_LOOKUP_LIST, GET_CONTAINER_LOOKUP_LIST_SUCCESS, GET_CONTAINER_LOOKUP_LIST_FAILURE] = createRequestActionTypes('container/GET_CONTAINER_LOOKUP_LIST');
export const getContainerLookupList = createAction(GET_CONTAINER_LOOKUP_LIST, (...actions) => actions);

/**
 * 모달 데이터(일시적인 데이터) 조회
 */
export const GET_CONTAINER_MODAL = 'container/GET_CONTAINER_MODAL';
export const getContainerModal = createAction(GET_CONTAINER_MODAL, ({ containerSeq, callback }) => ({ containerSeq, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_CONTAINER = 'container/CHANGE_CONTAINER';
export const CHANGE_CONTAINER_BODY = 'container/CHANGE_CONTAINER_BODY';
export const CHANGE_INVALID_LIST = 'domain/CHANGE_INVALID_LIST';
export const changeContainer = createAction(CHANGE_CONTAINER, (container) => container);
export const changeContainerBody = createAction(CHANGE_CONTAINER_BODY, (containerBody) => containerBody);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_CONTAINER = 'container/SAVE_CONTAINER';
export const saveContainer = createAction(SAVE_CONTAINER, ({ actions, callback }) => ({ actions, callback }));

/**
 * 삭제
 */
export const [DELETE_CONTAINER, DELETE_CONTAINER_SUCCESS] = createRequestActionTypes('container/DELETE_CONTAINER');
export const deleteContainer = createAction(DELETE_CONTAINER, ({ containerSeq, callback }) => ({ containerSeq, callback }));

/**
 * 관련아이템있는지 확인
 */
export const HAS_RELATION_LIST = 'container/HAS_RELATION_LIST';
export const hasRelationList = createAction(HAS_RELATION_LIST, ({ containerSeq, callback }) => ({ containerSeq, callback }));

/**
 * 태그삽입
 */
export const APPEND_TAG = 'page/APPEND_TAG';
export const appendTag = createAction(APPEND_TAG, (inputTag) => inputTag);
