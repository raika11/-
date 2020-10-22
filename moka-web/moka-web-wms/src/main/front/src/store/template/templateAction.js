import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'template/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'template/CLEAR_STORE';
export const CLEAR_TEMPLATE = 'template/CLEAR_TEMPLATE';
export const CLEAR_LIST = 'template/CLEAR_LIST';
export const CLEAR_SEARCH = 'template/CLEAR_SEARCH';
export const CLEAR_RELATION_LIST = 'template/CLEAR_RELATION_LIST';
export const CLEAR_HISTORY = 'template/CLEAR_HISTORY';
export const clearStore = createAction(CLEAR_STORE);
export const clearTemplate = createAction(CLEAR_TEMPLATE);
export const clearList = createAction(CLEAR_STORE);
export const clearSearch = createAction(CLEAR_STORE);
export const clearRelationList = createAction(CLEAR_RELATION_LIST);
export const clearHistory = createAction(CLEAR_HISTORY);

/**
 * 데이터 조회
 */
export const [GET_TEMPLATE_LIST, GET_TEMPLATE_LIST_SUCCESS, GET_TEMPLATE_LIST_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE_LIST');
export const [GET_TEMPLATE, GET_TEMPLATE_SUCCESS, GET_TEMPLATE_FAILURE] = createRequestActionTypes('template/GET_TEMPLATE');
export const getTemplateList = createAction(GET_TEMPLATE_LIST, (...actions) => actions);
export const getTemplate = createAction(GET_TEMPLATE, (templateSeq) => templateSeq);

/**
 * 데이터 변경
 */
export const CHANGE_TEMPLATE_BODY = 'template/CHANGE_TEMPLATE_BODY';
export const CHANGE_TEMPLATE = 'template/CHANGE_TEMPLATE';
export const CHANGE_INVALID_LIST = 'domain/CHANGE_INVALID_LIST';
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
export const deleteTemplate = createAction(DELETE_TEMPLATE, ({ templateSeq }) => ({ templateSeq }));

/**
 * 관련아이템 검색조건 변경
 */
export const CHANGE_SEARCH_PG_OPTION = 'template/CHANGE_SEARCH_PG_OPTION';
export const CHANGE_SEARCH_SK_OPTION = 'template/CHANGE_SEARCH_SK_OPTION';
export const CHANGE_SEARCH_CT_OPTION = 'template/CHANGE_SEARCH_CT_OPTION';
export const CHANGE_SEARCH_CP_OPTION = 'template/CHANGE_SEARCH_CP_OPTION';
export const changeSearchPGOption = createAction(CHANGE_SEARCH_PG_OPTION, (search) => search);
export const changeSearchSKOption = createAction(CHANGE_SEARCH_SK_OPTION, (search) => search);
export const changeSearchCTOption = createAction(CHANGE_SEARCH_CT_OPTION, (search) => search);
export const changeSearchCPOption = createAction(CHANGE_SEARCH_CP_OPTION, (search) => search);

/**
 * 관련아이템 데이터 조회
 */
export const HAS_RELATION_LIST = 'template/HAS_RELATION_LIST';
export const [GET_RELATION_LIST, GET_RELATION_LIST_SUCCESS, GET_RELATION_LIST_FAILURE] = createRequestActionTypes('template/GET_RELATION_LIST');
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
export const getRelationCPList = createAction(GET_RELATION_LIST, (...actions) => ({
    actions: actions,
    relType: 'CP',
}));

/**
 * 히스토리 검색조건 변경
 */
export const CHANGE_SEARCH_HIST_OPTION = 'template/CHANGE_SEARCH_HIST_OPTION';
export const changeSearchHistOption = createAction(CHANGE_SEARCH_HIST_OPTION, (search) => search);

/**
 * 히스토리 데이터 조회
 */
export const [GET_HISTORY_LIST, GET_HISTORY_LIST_SUCCESS, GET_HISTORY_LIST_FAILURE] = createRequestActionTypes('template/GET_HISTORY_LIST');
export const getHistoryList = createAction(GET_HISTORY_LIST, (...actions) => actions);
