import { createRequestActionTypes } from '@store/commons/saga';
import { createAction } from 'redux-actions';

export const CLEAR_STORE = 'ab/CLEAR_STORE';
export const clearStore = createAction(CLEAR_STORE);

export const CLEAR_AB_TEST = 'ab/CLEAR_AB_TEST';
export const clearAbTest = createAction(CLEAR_AB_TEST);

export const CHANGE_SEARCH_OPTIONS = 'ab/CHANGE_SEARCH_OPTIONS';
export const changeSearchOptions = createAction(CHANGE_SEARCH_OPTIONS);

export const [GET_AB_TEST_LIST, GET_AB_TEST_LIST_SUCCESS, GET_AB_TEST_LIST_FAILURE] = createRequestActionTypes('ab/GET_AB_TEST_LIST');
export const getAbTestList = createAction(GET_AB_TEST_LIST);
