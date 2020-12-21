import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 매체 조회
export const [GET_SOURCE_LIST, GET_SOURCE_LIST_SUCCESS, GET_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_SOURCE_LIST');
export const getSourceList = createAction(GET_SOURCE_LIST, () => ({}));

// 벌크전송 매체 목록 조회(네이버채널용)
export const [GET_BLUK_SOURCE_LIST, GET_BLUK_SOURCE_LIST_SUCCESS, GET_BLUK_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_BLUK_SOURCE_LIST');
export const getBulkSourceList = createAction(GET_BLUK_SOURCE_LIST, () => ({}));
