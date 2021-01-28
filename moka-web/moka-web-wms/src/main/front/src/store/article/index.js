import * as action from './articleAction';
import * as reducer from './articleReducer';

export * from './articleAction';
export * from './articleReducer';

export default {
    ...action,
    ...reducer,
};
