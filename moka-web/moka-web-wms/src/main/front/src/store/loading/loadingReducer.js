import { handleActions } from 'redux-actions';
import * as act from './loadingAction';

export default handleActions(
    {
        [act.START_LOADING]: (state, { payload }) => ({
            ...state,
            [payload]: true,
        }),
        [act.FINISH_LOADING]: (state, { payload }) => ({
            ...state,
            [payload]: false,
        }),
    },
    {},
);
