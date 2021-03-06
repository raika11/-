import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 * 기본 리스트 + 관련탭에서 사용하는 lookup 리스트
 */
export const CHANGE_SEARCH_OPTION = 'template/CHANGE_SEARCH_OPTION';
export const CHANGE_LOOKUP_SEARCH_OPTION = 'template/CHANGE_REF_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);
export const changeLookupSearchOption = createAction(CHANGE_LOOKUP_SEARCH_OPTION, (search) => search);

/**
 * 모달 데이터 조회
 */
export const GET_TEMPLATE_LIST_MODAL = 'template/GET_TEMPLATE_LIST_MODAL';
export const getTemplateListModal = createAction(GET_TEMPLATE_LIST_MODAL, ({ search, callback }) => ({ search, callback }));
export const GET_TEMPLATE_MODAL = 'template/GET_TEMPLATE_MODAL';
export const getTemplateModal = createAction(GET_TEMPLATE_MODAL, ({ templateSeq, callback }) => ({ templateSeq, callback }));

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'template/CLEAR_STORE';
export const CLEAR_TEMPLATE = 'template/CLEAR_TEMPLATE';
export const CLEAR_LIST = 'template/CLEAR_LIST';
export const CLEAR_SEARCH = 'template/CLEAR_SEARCH';
export const CLEAR_LOOKUP = 'template/CLEAR_LOOKUP';
export const clearStore = createAction(CLEAR_STORE);
export const clearTemplate = createAction(CLEAR_TEMPLATE);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);
export const clearLookup = createAction(CLEAR_LOOKUP);

/**
 * 데이터 조회
 */
export const [GET_TEMPLATE_LIST, GET_TEMPLATE_LIST_SUCCESS, GET_TEMPLATE_LIST_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE_LIST');
export const [GET_TEMPLATE, GET_TEMPLATE_SUCCESS, GET_TEMPLATE_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE');
export const getTemplateList = createAction(GET_TEMPLATE_LIST, (...actions) => actions);
export const getTemplate = createAction(GET_TEMPLATE, ({ templateSeq, callback }) => ({ templateSeq, callback }));
export const [GET_TEMPLATE_LOOKUP_LIST, GET_TEMPLATE_LOOKUP_LIST_SUCCESS, GET_TEMPLATE_LOOKUP_LIST_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE_LOOKUP_LIST');
export const getTemplateLookupList = createAction(GET_TEMPLATE_LOOKUP_LIST, (...actions) => actions);

/**
 * 데이터 변경
 */
export const CHANGE_TEMPLATE_BODY = 'template/CHANGE_TEMPLATE_BODY';
export const CHANGE_TEMPLATE = 'template/CHANGE_TEMPLATE';
export const CHANGE_INVALID_LIST = 'template/CHANGE_INVALID_LIST';
export const changeTemplateBody = createAction(CHANGE_TEMPLATE_BODY, (templateBody) => templateBody);
export const changeTemplate = createAction(CHANGE_TEMPLATE, (template) => template);
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_TEMPLATE = 'template/SAVE_TEMPLATE';
export const saveTemplate = createAction(SAVE_TEMPLATE, ({ actions, callback }) => ({ actions, callback }));

/**
 * 복사
 */
export const COPY_TEMPLATE = 'template/COPY_TEMPLATE';
export const copyTemplate = createAction(COPY_TEMPLATE, ({ templateSeq, templateName, domainId, callback }) => ({ templateSeq, templateName, domainId, callback }));

/**
 * 삭제
 */
export const [DELETE_TEMPLATE, DELETE_TEMPLATE_SUCCESS] = createRequestActionTypes('template/DELETE_TEMPLATE');
export const deleteTemplate = createAction(DELETE_TEMPLATE, ({ templateSeq, callback }) => ({ templateSeq, callback }));

/**
 * 관련아이템있는지 확인
 */
export const HAS_RELATION_LIST = 'template/HAS_RELATION_LIST';
export const hasRelationList = createAction(HAS_RELATION_LIST, ({ templateSeq, callback }) => ({ templateSeq, callback }));
