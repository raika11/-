import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import loading from '@store/loading/loadingReducer';
import layout from '@store/layout/layoutReducer';
import auth from '@store/auth/authReducer';
import domain from '@store/domain/domainReducer';
import template from '@store/template/templateReducer';
import templateRelationList from '@store/template/templateRelationListReducer';
import templateHistory from '@store/template/templateHistoryReducer';
import toast from '@store/notification/toastReducer';
import codeMgt from '@store/codeMgt/codeMgtReducer';
import reserved from '@store/reserved/reservedReducer';

export default combineReducers({
    toastr,
    loading,
    layout,
    auth,
    domain,
    template,
    templateRelationList,
    templateHistory,
    toast,
    codeMgt,
    reserved,
});
