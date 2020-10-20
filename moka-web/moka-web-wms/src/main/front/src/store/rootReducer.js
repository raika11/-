import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import loading from '@store/loading/loadingReducer';
import layout from '@store/layout/layoutReducer';
import auth from '@store/auth/authReducer';
import domain from '@store/domain/domainReducer';
import template from '@store/template/templateReducer';
import templateRelations from '@store/template/templateRelationsReducer';
import toast from '@store/notification/toastReducer';
import codeMgt from '@store/codeMgt/codeMgtReducer';

export default combineReducers({
    toastr,
    loading,
    layout,
    auth,
    domain,
    template,
    templateRelations,
    toast,
    codeMgt,
});
