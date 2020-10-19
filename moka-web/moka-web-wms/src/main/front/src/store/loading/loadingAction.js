import { createAction } from 'redux-actions';

export const START_LOADING = 'loading/START_LOADING';
export const FINISH_LOADING = 'loading/FINISH_LOADING';

/**
 * 액션creator
 */
export const startLoading = createAction(START_LOADING, (payload) => payload);
export const finishLoading = createAction(FINISH_LOADING, (payload) => payload);
