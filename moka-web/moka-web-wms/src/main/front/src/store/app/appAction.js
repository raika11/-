import { createAction } from 'redux-actions';
import { createRequestActionTypes } from '@store/commons/saga';

export const [INIT, INIT_SUCCESS, INIT_FAILURE] = createRequestActionTypes('app/INIT');
export const init = createAction(INIT);
