import {createAction} from "redux-actions";

/**
 * action
 */
export const ENQUEUE_TOAST = 'toastReducer/ENQUEUE_TOAST';
export const REMOVE_TOAST = 'toastReducer/REMOVE_TOAST';

/**
 * action creator
 */
export const enqueueToast = createAction(ENQUEUE_TOAST, ({ key, message, options, callback }) => ({
    key,
    message,
    options,
    callback,
}));
export const removeToast = createAction(REMOVE_TOAST, ({ key }) => ({ key }));