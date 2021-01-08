import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// NONE API
export const CLEAR_STORE = 'seoMeta/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

export const CLEAR_SEO_META = 'seoMeta/CLEAR_SEO_META';
export const clearSeoMeta = createAction(CLEAR_SEO_META);

export const CLEAR_LIST = 'seoMeta/CLEAR_LIST';
export const clearSeoMetaList = createAction(CLEAR_LIST);

export const CLEAR_SEARCH = 'seoMeta/CLEAR_SEARCH';
export const clearSearch = createAction(CLEAR_SEARCH);

export const CHANGE_SEO_META_SEARCH_OPTIONS = 'seoMeta/CHANGE_SEARCH_OPTIONS';
export const changeSeoMetaSearchOptions = createAction(CHANGE_SEO_META_SEARCH_OPTIONS);

// API
export const [GET_SEO_META, GET_SEO_META_SUCCESS, GET_SEO_META_FAILURE] = createRequestActionTypes('seoMeta/GET_SEO_META');
export const getSeoMeta = createAction(GET_SEO_META);

export const [GET_SEO_META_LIST, GET_SEO_META_LIST_SUCCESS, GET_SEO_META_LIST_FAILURE] = createRequestActionTypes('seoMeta/GET_SEO_META_LIST');
export const getSeoMetaList = createAction(GET_SEO_META_LIST);

export const SAVE_SEO_META = 'seoMeta/SAVE_SEO_META';
export const saveSeoMeta = createAction(SAVE_SEO_META);

export const DELETE_SEO_META = 'seoMeta/DELETE_SEO_META';
export const deleteSeoMeta = createAction(DELETE_SEO_META);
