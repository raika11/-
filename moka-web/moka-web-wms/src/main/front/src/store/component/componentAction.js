import { createAction } from 'redux-actions';

/**
 * 저장 액션
 */
export const SAVE_COMPONENT_LIST = 'component/SAVE_COMPONENT_LIST';
export const saveComponentList = createAction(SAVE_COMPONENT_LIST, (payload) => payload);
