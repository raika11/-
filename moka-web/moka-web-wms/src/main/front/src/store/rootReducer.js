import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import app from '@store/app/appReducer';
import loading from '@store/loading/loadingReducer';
import layout from '@store/layout/layoutReducer';
import auth from '@store/auth/authReducer';
import domain from '@store/domain/domainReducer';
import template from '@store/template/templateReducer';
import templateHistory from '@store/template/templateHistoryReducer';
import codeMgt from '@store/codeMgt/codeMgtReducer';
import reserved from '@store/reserved/reservedReducer';
import dataset from '@store/dataset/datasetReducer';
import datasetRelationList from '@store/dataset/datasetRelationListReducer';
import component from '@store/component/componentReducer';
import page from '@store/page/pageReducer';
import pageHistory from '@store/page/pageHistoryReducer';
import editForm from '@/store/editForm/editFormReducer';
import relation from '@store/relation/relationReducer';

export default combineReducers({
    toastr,
    app,
    loading,
    layout,
    auth,
    domain,
    template,
    templateHistory,
    codeMgt,
    reserved,
    dataset,
    datasetRelationList,
    component,
    page,
    pageHistory,
    editForm,
    relation,
});
