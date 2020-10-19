import { createAction } from 'redux-actions';

/**
 * 검색조건 변경 액션
 */
export const CHANGE_SEARCH_OPTION = 'template/CHANGE_SEARCH_OPTION';
export const CHANGE_SEARCH_OPTIONS = 'template/CHANGE_SEARCH_OPTIONS';

/**
 * 검색조건 변경 액션creator
 */
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, ({ key, value }) => ({ key, value }));
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS, (payload) => payload);

/**
 * 스토어 데이터 삭제 액션
 */
export const CLEAR_TEMPLATE = 'template/CLEAR_TEMPLATE';
export const CLEAR_TEMPLATE_LIST = 'template/CLEAR_TEMPLATE_LIST';
export const CLEAR_SEARCH_OPTION = 'template/CLEAR_SEARCH_OPTION';

/**
 * 스토어 데이터 삭제 액션creator
 */
export const clearTemplate = createAction(CLEAR_TEMPLATE, (payload) => payload);
