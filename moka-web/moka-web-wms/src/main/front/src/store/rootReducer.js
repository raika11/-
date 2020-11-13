import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import app from '@store/app/appReducer';
import loading from '@store/loading/loadingReducer';
import layout from '@store/layout/layoutReducer';
import auth from '@store/auth/authReducer';
import article from '@store/article/articleReducer';
import domain from '@store/domain/domainReducer';
import template from '@store/template/templateReducer';
import code from '@store/code/codeReducer';
import codeMgt from '@store/codeMgt/codeMgtReducer';
import reserved from '@store/reserved/reservedReducer';
import dataset from '@store/dataset/datasetReducer';
import component from '@store/component/componentReducer';
import container from '@store/container/containerReducer';
import page from '@store/page/pageReducer';
import editForm from '@/store/editForm/editFormReducer';
import relation from '@store/relation/relationReducer';
import history from '@store/history/historyReducer';
import merge from '@store/merge/mergeReducer';
import menu from '@store/menu/menuReducer';
import group from '@store/group/groupReducer';
import area from '@store/area/areaReducer';
import reporter from '@store/reporter/reporterReducer';
import directLink from '@store/directLink/directLinkReducer';

export default combineReducers({
    toastr,
    app,
    loading,
    layout,
    auth,
    article,
    domain,
    template,
    code,
    codeMgt,
    reserved,
    dataset,
    component,
    container,
    page,
    area,
    editForm,
    relation,
    history,
    merge,
    menu,
    group,
    reporter,
    directLink,
});
