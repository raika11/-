import { handleActions } from 'redux-actions';
import * as act from './appAction';

/**
 * initialState
 */
const initialState = {
    APP_LOADING: true,
    APP_ERROR: false,
};

/**
 * reducer
 */
export default handleActions(
    {
        [act.INIT_SUCCESS]: (state, { payload: { body } }) => ({
            ...body,
            APP_LOADING: false,
            APP_ERROR: false,
        }),
        [act.INIT_FAILURE]: () => ({
            APP_LOADING: false,
            APP_ERROR: true,
        }),
    },
    initialState,
);
