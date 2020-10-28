import { handleActions } from 'redux-actions';
import * as act from './appAction';

/**
 * initialState
 */
const initialState = {
    AppLoading: true,
    AppError: false,
};

/**
 * reducer
 */
export default handleActions(
    {
        [act.INIT_SUCCESS]: (state, { payload: { body } }) => ({
            ...body,
            AppLoading: false,
            AppError: false,
        }),
        [act.INIT_FAILURE]: () => ({
            AppLoading: false,
            AppError: true,
        }),
    },
    initialState,
);
