import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import loading from '@store/loading/loadingReducer';
import layout from '@store/layout/layoutReducer';
import auth from '@store/auth/authReducer';
import domain from '@store/domain/domainReducer';
import template from '@store/template/templateReducer';
import templateRelationList from '@store/template/templateRelationListReducer';
import templateHistory from '@store/template/templateHistoryReducer';
import codeMgt from '@store/codeMgt/codeMgtReducer';
import reserved from '@store/reserved/reservedReducer';
import dataset from '@store/dataset/datasetReducer';
import datasetRelationList from '@store/dataset/datasetRelationListReducer';
import component from '@store/component/componentReducer';
import page from '@store/page/pageReducer';
import pageHistory from '@store/page/pageHistoryReducer';
import dynamicForm from '@store/dynamic/dynamicFormReducer';
import relation from '@store/relation/relationReducer';

export default combineReducers({
    toastr,
    loading,
    layout,
    auth,
    domain,
    template,
    templateRelationList,
    templateHistory,
    codeMgt,
    reserved,
    dataset,
    datasetRelationList,
    component,
    page,
    pageHistory,
    dynamicForm,
    relation,
});
