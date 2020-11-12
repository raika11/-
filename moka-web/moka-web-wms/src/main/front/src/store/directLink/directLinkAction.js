import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 검색조건 변경
 */
export const CHANGE_SEARCH_OPTION = 'directLink/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'directLink/CLEAR_STORE';
export const CLEAR_DIRECT_LINK = 'directLink/CLEAR_DIRECT_LINK';
export const clearStore = createAction(CLEAR_STORE);
export const clearDirectLink = createAction(CLEAR_DIRECT_LINK);

/**
 * 데이터 조회
 */
export const [GET_DIRECT_LINK_LIST, GET_DIRECT_LINK_LIST_SUCCESS, GET_DIRECT_LINK_LIST_FAILURE] = createRequestActionTypes('directLink/GET_DIRECT_LINK_LIST');
export const [GET_DIRECT_LINK, GET_DIRECT_LINK_SUCCESS, GET_DIRECT_LINK_FAILURE] = createRequestActionTypes('directLink/GET_DIRECT_LINK');
export const getDirectLinkList = createAction(GET_DIRECT_LINK_LIST, (...actions) => actions);
export const getDirectLink = createAction(GET_DIRECT_LINK, ({ linkSeq, callback }) => ({ linkSeq, callback }));

/**
 * 데이터 변경
 */
export const CHANGE_DIRECT_LINK = 'directLink/CHANGE_DIRECT_LINK';
export const changeDirectLink = createAction(CHANGE_DIRECT_LINK, (directLink) => directLink);
export const CHANGE_INVALID_LINK = 'directLink/CHANGE_INVALID_LINK';
export const changeInvalidList = createAction(CHANGE_INVALID_LINK, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_DIRECT_LINK = 'directLink/SAVE_DIRECT_LINK';
export const saveDirectLink = createAction(SAVE_DIRECT_LINK, ({ type, actions, callback }) => ({ type, actions, callback }));
