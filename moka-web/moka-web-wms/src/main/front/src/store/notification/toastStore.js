import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

/**
 * action
 */
export const ENQUEUE_TOAST = 'toastStore/ENQUEUE_TOAST';
export const REMOVE_TOAST = 'toastStore/REMOVE_TOAST';

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

/**
 * initialState
 */
const initialState = {
    noti: [],
};

/**
 * reducer
 */
const toastStore = handleActions(
    {
        [ENQUEUE_TOAST]: (state, { payload }) => {
            return produce(state, (draft) => {
                const idx = draft.noti.indexOf(payload.key);
                if (idx > -1) {
                    // 동일한 노티가 있으면 덮어쓴다
                    draft.noti.splice(idx, 1, {
                        key: payload.key,
                        message: payload.message,
                        options: payload.options,
                        callback: payload.callback,
                    });
                } else {
                    draft.noti.push({
                        key: payload.key,
                        message: payload.message,
                        options: payload.options,
                        callback: payload.callback,
                    });
                }
            });
        },
        [REMOVE_TOAST]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.noti.splice(
                    draft.noti.findIndex((no) => no.key === payload.key),
                    1,
                );
            });
        },
    },
    initialState,
);

export default toastStore;
