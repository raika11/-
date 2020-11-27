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
export const CHANGE_INVALID_LIST = 'editForm/CHANGE_INVALID_LIST';
export const changeInvalidList = createAction(CHANGE_INVALID_LIST, (invalidList) => invalidList);

export const CHANGE_EDIT_FORM = 'editForm/CHANGE_EDIT_FORM';
export const changeEditForm = createAction(CHANGE_EDIT_FORM, (editForm) => editForm);

export const CHANGE_EDIT_FORM_PART = 'editForm/CHANGE_EDIT_FORM_PART';
export const changeEditFormPart = createAction(CHANGE_EDIT_FORM_PART, (recoveryData) => ({ recoveryData }));

export const CHANGE_FIELD = 'editForm/CHANGE_FIELD';
export const changeField = createAction(CHANGE_FIELD, (partIdx, groupIdx, fieldIdx, field) => ({ partIdx, groupIdx, fieldIdx, field }));

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

/**
 * 퍼블리시 모달 show/hide
 */
export const PUBLISH_MODAL = 'editForm/PUBLISH_MODAL';
export const showPublishModal = createAction(PUBLISH_MODAL, (show, editFormPart) => ({ show, editFormPart }));

/**
 * 퍼블리시 모달 show/hide
 */
export const HISTORY_MODAL = 'editForm/HISTORY_MODAL';
export const showHistoryModal = createAction(HISTORY_MODAL, (show, editFormPart, partIdx) => ({ show, editFormPart, partIdx }));

/**
 * 이력 검색 조건
 */
export const CHANGE_SEARCH_OPTION = 'editForm/CHANGE_SEARCH_OPTION';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION, (search) => search);

/**
 * 이력 검색 조건
 */

export const [GET_EDIT_FORM_HISTORY_LIST, GET_EDIT_FORM_HISTORY_LIST_SUCCESS, GET_EDIT_FORM_HISTORY_LIST_FAILURE] = createRequestActionTypes('editForm/GET_EDIT_FORM_HISTORY_LIST');
export const getEditFormHistoryList = createAction(GET_EDIT_FORM_HISTORY_LIST, (editFormPart, search) => ({ editFormPart, search }));

/**
 * 편집 폼 XML Export
 */
export const [EXPORT_EDIT_FROM_XML, EXPORT_EDIT_FROM_XML_SUCCESS, EXPORT_EDIT_FROM_XML_FAILURE] = createRequestActionTypes('editForm/EXPORT_EDIT_FROM_XML');
export const exportEditFormXml = createAction(EXPORT_EDIT_FROM_XML, (formSeq) => formSeq);

/**
 * 편집 폼 XML Export
 */
export const [EXPORT_EDIT_FROM_PART_XML, EXPORT_EDIT_FROM_PART_XML_SUCCESS, EXPORT_EDIT_FROM_PART_XML_FAILURE] = createRequestActionTypes('editForm/EXPORT_EDIT_FROM_PART_XML');
export const exportEditFormPartXml = createAction(EXPORT_EDIT_FROM_PART_XML, (part) => part);

/**
 * 편집 폼 XML Export
 */
export const [EXPORT_EDIT_FROM_PART_HISTORY_XML, EXPORT_EDIT_FROM_PART_HISTORY_XML_SUCCESS, EXPORT_EDIT_FROM_PART_HISTORY_XML_FAILURE] = createRequestActionTypes(
    'editForm/EXPORT_EDIT_FROM_PART_HISTORY_XML',
);
export const exportEditFormPartHistoryXml = createAction(EXPORT_EDIT_FROM_PART_HISTORY_XML, (history) => history);
