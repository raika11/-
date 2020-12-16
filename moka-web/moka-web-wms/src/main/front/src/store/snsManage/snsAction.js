import { createRequestActionTypes } from '@store/commons/saga';
import { createAction } from 'redux-actions';

/*************** 메타 *******************/
export const CLEAR_META_STORE = 'sns/CLEAR_META_STORE';
export const clearMetaStore = createAction(CLEAR_META_STORE);

export const CLEAR_SNS_META = 'sns/CLEAR_SNS_META';
export const clearSnsMeta = createAction(CLEAR_SNS_META);

export const [GET_SNS_META_LIST, GET_SNS_META_LIST_SUCCESS, GET_SNS_META_LIST_FAILURE] = createRequestActionTypes('sns/GET_SNS_META_LIST');
export const getSNSMetaList = createAction(GET_SNS_META_LIST, ({ payload }) => payload);

export const [GET_SNS_META, GET_SNS_META_SUCCESS, GET_SNS_META_FAILURE] = createRequestActionTypes('sns/GET_SNS_META');
export const getSnsMeta = createAction(GET_SNS_META, (payload) => payload);

export const CHANGE_SNS_META_SEARCH_OPTIONS = 'sns/CHANGE_SNS_META_SEARCH_OPTIONS';
export const changeSnsMetaSearchOptions = createAction(CHANGE_SNS_META_SEARCH_OPTIONS, (search) => search);

export const SAVE_SNS_META = 'sns/SAVE_SNS_META';
export const saveSnsMeta = createAction(SAVE_SNS_META);

export const PUBLISH_SNS_META = 'sns/PUBLISH_SNS_META';
export const publishSnsMeta = createAction(PUBLISH_SNS_META);
/*************** 메타 *******************/

/*************** 전송기사 *******************/
export const [GET_SNS_SEND_ARTICLE_LIST, GET_SNS_SEND_ARTICLE_LIST_SUCCESS, GET_SNS_SEND_ARTICLE_LIST_FAILURE] = createRequestActionTypes('sns/GET_SNS_SEND_ARTICLE_LIST');
export const getSnsSendArticleList = createAction(GET_SNS_SEND_ARTICLE_LIST);

export const CHANGE_SNS_SEND_ARTICLE_SEARCH_OPTIONS = 'sns/CHANGE_SNS_SEND_ARTICLE_SEARCH_OPTIONS';
export const changeSnsSendArticleSearchOptions = createAction(CHANGE_SNS_SEND_ARTICLE_SEARCH_OPTIONS);
