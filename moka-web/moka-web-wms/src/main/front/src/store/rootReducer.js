import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';

import layout from './layout/layoutReducer';
import auth from '@store/auth/authReducer';
import domain from '@store/domain/domainReducer';

export default combineReducers({
    toastr,
    layout,
    auth,
    domain,
});
