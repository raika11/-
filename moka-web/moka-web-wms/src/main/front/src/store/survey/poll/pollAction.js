import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// NONE API
export const CLEAR_STORE = 'poll/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

export const CLEAR_SEO_META = 'poll/CLEAR_SEO_META';
export const clearSeoMeta = createAction(CLEAR_SEO_META);

export const CLEAR_LIST = 'poll/CLEAR_LIST';
export const clearSeoMetaList = createAction(CLEAR_LIST);

export const CLEAR_SEARCH = 'poll/CLEAR_SEARCH';
export const clearSearch = createAction(CLEAR_SEARCH);

export const CHANGE_SEO_META_SEARCH_OPTIONS = 'poll/CHANGE_SEARCH_OPTIONS';
export const changeSeoMetaSearchOptions = createAction(CHANGE_SEO_META_SEARCH_OPTIONS);

// API
export const [GET_POLL, GET_POLL_SUCCESS, GET_POLL_FAILURE] = createRequestActionTypes('poll/GET_POLL');
export const getPoll = createAction(GET_POLL);

export const [GET_POLL_LIST, GET_POLL_LIST_SUCCESS, GET_POLL_LIST_FAILURE] = createRequestActionTypes('poll/GET_POLL_LIST');
export const getPollList = createAction(GET_POLL_LIST);

export const SAVE_POLL = 'poll/SAVE_POLL';
export const savePoll = createAction(SAVE_POLL);

export const DELETE_POLL = 'poll/DELETE_POLL';
export const deletePoll = createAction(DELETE_POLL);

export const [GET_POLL_GROUP_CODES, GET_POLL_GROUP_CODES_SUCCESS, GET_POLL_GROUP_CODES_FAILURE] = createRequestActionTypes('poll/GET_POLL_GROUP_CODES');
export const getPollGroupCodes = createAction(GET_POLL_GROUP_CODES, () => 'POLL_GRP');

export const [GET_POLL_CATEGORY_CODES, GET_POLL_CATEGORY_CODES_SUCCESS, GET_POLL_CATEGORY_FAILURE] = createRequestActionTypes('poll/GET_POLL_CATEGORY_CODES');
export const getPollCategoryCodes = createAction(GET_POLL_CATEGORY_CODES, () => 'POLL_CATE');
