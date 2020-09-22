import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';

import layout from './layout/layoutReducer';

export default combineReducers({
    toastr,
    layout
});
