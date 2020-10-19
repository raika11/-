import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as act from './toastAction';

/**
 * initialState
 */
const initialState = {
    noti: [],
};

/**
 * reducer
 */
const toastReducer = handleActions(
    {
        [act.ENQUEUE_TOAST]: (state, { payload }) => {
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
        [act.REMOVE_TOAST]: (state, { payload }) => {
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

export default toastReducer;
