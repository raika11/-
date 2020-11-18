import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

/**
 * 스토어 데이터 삭제
 */
export const CLEAR_STORE = 'editForm/CLEAR_EDIT_FORM_ALL';
export const CLEAR_EDIT_FORM = 'editForm/CLEAR_EDIT_FORM';
export const CLEAR_LIST = 'editForm/CLEAR_LIST';
export const CLEAR_SEARCH = 'editForm/CLEAR_SEARCH';
export const clearStore = createAction(CLEAR_STORE);
export const clearEditForm = createAction(CLEAR_EDIT_FORM);
export const clearList = createAction(CLEAR_LIST);
export const clearSearch = createAction(CLEAR_SEARCH);

/**
 * 데이터 조회
 */
export const [GET_EDIT_FORM_LIST, GET_EDIT_FORM_LIST_SUCCESS, GET_EDIT_FORM_LIST_FAILURE] = createRequestActionTypes('editForm/GET_EDIT_FORM_LIST');
export const [GET_EDIT_FORM, GET_EDIT_FORM_SUCCESS, GET_EDIT_FORM_FAILURE] = createRequestActionTypes('editForm/GET_EDIT_FORM');
export const getEditFormList = createAction(GET_EDIT_FORM_LIST, (...actions) => actions);
export const getEditForm = createAction(GET_EDIT_FORM, (partId) => partId);

/**
 * 데이터 변경
 */
export const CHANGE_EDIT_FORM = 'editForm/CHANGE_EDIT_FORM';
export const CHANGE_EDIT_FORM_PART = 'editForm/CHANGE_EDIT_FORM_PART';
export const CHANGE_FIELD = 'editForm/CHANGE_FIELD';
export const CHANGE_INVALID_LIST = 'editForm/CHANGE_INVALID_LIST';
export const changeEditForm = createAction(CHANGE_EDIT_FORM, (editForm) => editForm);
export const changeField = createAction(CHANGE_FIELD, (partIdx, groupIdx, fieldIdx, field) => ({ partIdx, groupIdx, fieldIdx, field }));
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

/**
 * 저장
 */
export const SAVE_EDIT_FORM = 'editForm/SAVE_EDIT_FORM';
export const saveEditForm = createAction(SAVE_EDIT_FORM, ({ type, formSeq, partSeq, actions, callback }) => ({ type, formSeq, partSeq, actions, callback }));
export const SAVE_EDIT_FORM_PART = 'editForm/SAVE_EDIT_FORM_PART';
export const saveEditFormPart = createAction(SAVE_EDIT_FORM_PART, ({ type, formSeq, partSeq, partJson, callback }) => ({ type, formSeq, partSeq, partJson, callback }));

/**
 * 삭제
 */
export const [DELETE_EDIT_FORM, DELETE_EDIT_FORM_SUCCESS, DELETE_EDIT_FORM_FAILURE] = createRequestActionTypes('editForm/DELETE_EDIT_FORM');
export const deleteEditForm = createAction(DELETE_EDIT_FORM, ({ partId, callback }) => ({ partId, callback }));

/**
 * 중복체크
 */
export const DUPLICATE_CHECK = 'editForm/DUPLICATE_CHECK';
export const duplicateCheck = createAction(DUPLICATE_CHECK, ({ formId, callback }) => ({ formId, callback }));
