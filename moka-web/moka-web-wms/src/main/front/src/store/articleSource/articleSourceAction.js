import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

// 데스킹 매체 조회
export const [GET_DESKING_SOURCE_LIST, GET_DESKING_SOURCE_LIST_SUCCESS, GET_DESKING_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_DESKING_SOURCE_LIST');
export const getDeskingSourceList = createAction(GET_DESKING_SOURCE_LIST, () => ({}));

// 타입별(JOONGANG/CONSALES/JSTORE/SOCIAL/BULK/RCV) 매체 목록 조회
export const [GET_TYPE_SOURCE_LIST, GET_TYPE_SOURCE_LIST_SUCCESS, GET_TYPE_SOURCE_LIST_FAILURE] = createRequestActionTypes('articleSource/GET_TYPE_SOURCE_LIST');
export const getTypeSourceList = createAction(GET_TYPE_SOURCE_LIST, ({ type, callback }) => ({ type, callback }));
