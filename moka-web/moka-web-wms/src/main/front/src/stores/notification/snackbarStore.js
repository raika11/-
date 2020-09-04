import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

/**
 * action
 */
export const ENQUEUE_SNACKBAR = 'snackbarStore/ENQUEUE_SNACKBAR';
export const REMOVE_SNACKBAR = 'snackbarStore/REMOVE_SNACKBAR';

/**
 * action creator
 */
export const enqueueSnackbar = createAction(
    ENQUEUE_SNACKBAR,
    ({ key, message, options, callback }) => ({
        key,
        message,
        options,
        callback
    })
);
export const removeSnackbar = createAction(REMOVE_SNACKBAR, ({ key }) => ({ key }));

/**
 * initialState
 */
const initialState = {
    noti: []
};

/**
 * reducer
 */
const snackbarStore = handleActions(
    {
        [ENQUEUE_SNACKBAR]: (state, { payload }) => {
            return produce(state, (draft) => {
                const idx = draft.noti.indexOf(payload.key);
                if (idx > -1) {
                    // 동일한 노티가 있으면 덮어쓴다
                    draft.noti.splice(idx, 1, {
                        key: payload.key,
                        message: payload.message,
                        options: payload.options,
                        callback: payload.callback
                    });
                } else {
                    draft.noti.push({
                        key: payload.key,
                        message: payload.message,
                        options: payload.options,
                        callback: payload.callback
                    });
                }
            });
        },
        [REMOVE_SNACKBAR]: (state, { payload }) => {
            return produce(state, (draft) => {
                draft.noti.splice(
                    draft.noti.findIndex((no) => no.key === payload.key),
                    1
                );
            });
        }
    },
    initialState
);

export default snackbarStore;
