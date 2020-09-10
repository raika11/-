import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';

import layout from './layout/reducer';

export default combineReducers({
    toastr,
    layout
});
