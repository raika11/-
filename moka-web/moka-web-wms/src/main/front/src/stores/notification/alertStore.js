import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

/**
 * action
 */
export const ALERT = 'alertStore/ALERT';
export const CONFIRM = 'alertStore/CONFIRM';

/**
 * action creator
 */

/**
 * initialState
 */
const initialState = {
    noti: []
};

/**
 * reducer
 */
const alertStore = handleActions(
    {
        [ALERT]: (state, { payload }) => {},
        [CONFIRM]: (state, { payload }) => {}
    },
    initialState
);

export default alertStore;
