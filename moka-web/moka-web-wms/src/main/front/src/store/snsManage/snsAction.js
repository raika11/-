import { createRequestActionTypes } from '@store/commons/saga';
import { createAction } from 'redux-actions';

export const CLEAR_SNS_META = 'sns/CLEAR_SNS_META';
export const clearSNSMeta = createAction(CLEAR_SNS_META);

export const [GET_SNS_META_LIST, GET_SNS_META_LIST_SUCCESS, GET_SNS_META_LIST_FAILURE] = createRequestActionTypes('sns/GET_SNS_META_LIST');
export const getSNSMetaList = createAction(GET_SNS_META_LIST, ({ payload }) => payload);

export const [GET_SNS_META, GET_SNS_META_SUCCESS, GET_SNS_META_FAILURE] = createRequestActionTypes('sns/GET_SNS_META');
export const getSnsMeta = createAction(GET_SNS_META, (payload) => payload);

export const CHANGE_SNS_META_SEARCH_OPTIONS = 'sns/CHANGE_SNS_META_SEARCH_OPTIONS';
export const changeSNSMetaSearchOptions = createAction(CHANGE_SNS_META_SEARCH_OPTIONS, (search) => search);
