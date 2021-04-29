import { createRequestActionTypes } from '@store/commons/saga';
import { createAction } from 'redux-actions';

export const CLEAR_STORE = 'ab/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

export const CLEAR_AB_TEST = 'ab/CLEAR_AB_TEST';
export const clearAbTest = createAction(CLEAR_AB_TEST);

export const CHANGE_SEARCH_OPTION = 'ab/CHANGE_SEARCH_OPTIONS';
export const changeSearchOption = createAction(CHANGE_SEARCH_OPTION);

export const [GET_AB_TEST_LIST, GET_AB_TEST_LIST_SUCCESS, GET_AB_TEST_LIST_FAILURE] = createRequestActionTypes('ab/GET_AB_TEST_LIST');
export const getAbTestList = createAction(GET_AB_TEST_LIST);

export const [GET_AB_TEST, GET_AB_TEST_SUCCESS, GET_AB_TEST_FAILURE] = createRequestActionTypes('ab/GET_AB_TEST');
export const getAbtest = createAction(GET_AB_TEST);

export const SAVE_AB_TEST = 'ab/SAVE_AB_TEST';
export const saveAbTest = createAction(SAVE_AB_TEST);
