import { createRequestActionTypes } from '@store/commons/saga';
import { createAction } from 'redux-actions';

export const CLEAR_PACKAGE_STORE = 'package/CLEAR_PACKAGE_STORE';
export const clearPackageStore = createAction(CLEAR_PACKAGE_STORE);

export const CLEAR_PACKAGE_LIST = 'package/CLEAR_PACKAGE_LIST';
export const clearPackageList = createAction(CLEAR_PACKAGE_LIST);

export const CLEAR_PACKAGE = 'package/CLEAR_PACKAGE';
export const clearPackage = createAction(CLEAR_PACKAGE);

export const [GET_PACKAGE_LIST, GET_PACKAGE_LIST_SUCCESS, GET_PACKAGE_LIST_FAILURE] = createRequestActionTypes('package/GET_PACKAGE_LIST');
export const getPackageList = createAction(GET_PACKAGE_LIST);

export const [GET_PACKAGE, GET_PACKAGE_SUCCESS, GET_PACKAGE_FAILURE] = createRequestActionTypes('package/GET_PACKAGE');
export const getPackage = createAction(GET_PACKAGE);

export const SAVE_PACKAGE = 'package/SAVE_PACKAGE';
export const savePackage = createAction(SAVE_PACKAGE);
