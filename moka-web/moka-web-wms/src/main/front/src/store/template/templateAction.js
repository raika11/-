import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'template/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'template/CHANGE_SEARCH_OPTIONS';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({ key, value }));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);

/**
 * 관련아이템 검색조건 변경
 */
export const CHANGE_SEARCH_PG_OPTION = 'template/CHANGE_SEARCH_PG_OPTION';
export const CHANGE_SERACH_PG_OPTIONS = 'template/CHANGE_SERACH_PG_OPTIONS';
export const CHANGE_SEARCH_SK_OPTION = 'template/CHANGE_SEARCH_SK_OPTION';
export const CHANGE_SEARCH_SK_OPTIONS = 'template/CHANGE_SEARCH_SK_OPTIONS';

export const CHANGE_SEARCH_REL_OPTION = 'template/CHANGE_SEARCH_REL_OPTION';
export const CHANGE_SEARCH_REL_OPTIONS = 'template/CHANGE_SEARCH_REL_OPTIONS';
export const changeSearchRelOption = createAction(CHANGE_SEARCH_REL_OPTION, ({ relType, key, value }) => ({ relType, key, value }));
export const changeSearchRelOptions = createAction(CHANGE_SEARCH_REL_OPTIONS, ({ relType, changes }) => ({ relType, changes }));

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_TEMPLATE = 'template/CLEAR_TEMPLATE';
export const CLEAR_TEMPLATE_LIST = 'template/CLEAR_TEMPLATE_LIST';
export const CLEAR_SEARCH_OPTION = 'template/CLEAR_SEARCH_OPTION';
export const clearTemplate = createAction(CLEAR_TEMPLATE, (payload) => payload);

/**
 * 데이터 조회
 */
export const [GET_TEMPLATE_LIST, GET_TEMPLATE_LIST_SUCCESS, GET_TEMPLATE_LIST_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE_LIST');
export const [GET_TEMPLATE, GET_TEMPLATE_SUCCESS, GET_TEMPLATE_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE');
export const getTemplateList = createAction(GET_TEMPLATE_LIST, (...payload) => payload);
export const getTemplate = createAction(GET_TEMPLATE, (payload) => payload);

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = createRequestActionTypes('templateRelations/HAS_RELATION_LIST');
export const hasRelationList = createAction(HAS_RELATION_LIST, (payload) => payload);
export const [GET_RELATION_LIST, GET_RELATION_LIST_SUCCESS, GET_RELATION_LIST_FAILURE] = createRequestActionTypes('templateRelations/GET_RELATION_LIST');
export const getRelationList = createAction(GET_RELATION_LIST, ({ relType, actions }) => ({ relType, actions }));

/**
 * 데이터 변경
 */
export const CHANGE_TEMPLATE_BODY = 'template/CHANGE_TEMPLATE_BODY';
export const CHANGE_TEMPLATE = 'template/CHANGE_TEMPLATE';
export const changeTemplateBody = createAction(CHANGE_TEMPLATE_BODY, (payload) => payload);
export const changeTemplate = createAction(CHANGE_TEMPLATE, (payload) => payload);

/**
 * 저장
 */
export const SAVE_TEMPLATE = 'template/SAVE_TEMPLATE';
export const saveTemplate = createAction(SAVE_TEMPLATE, (payload = {}) => payload);

/**
 * 복사
 */
export const COPY_TEMPLATE = 'template/COPY_TEMPLATE';
export const copyTemplate = createAction(COPY_TEMPLATE, (payload = {}) => payload);
