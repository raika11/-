import { combineReducers } from 'redux';

import { reducer as toastr } from 'react-redux-toastr';
import app from '@store/app/appReducer';
import loading from '@store/loading/loadingReducer';
import layout from '@store/layout/layoutReducer';
import auth from '@store/auth/authReducer';
import article from '@store/article/articleReducer';
import rcvArticle from '@store/rcvArticle/rcvArticleReducer';
import articleSource from '@store/articleSource/articleSourceReducer';
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
import desking from '@store/desking/deskingReducer';
import member from '@store/member/memberReducer';
import columnist from '@store/columnist/columnistReducer';
import photoArchive from '@store/photoArchive/photoArchiveReducer';
import articlePage from '@store/articlePage/articlePageReducer';
import sns from '@store/snsManage/snsReducer';
import bright from '@store/bright/brightReducer';
import bulks from '@store/bulks/bulksReducer';
import special from '@store/special/specialReducer';
import comment from '@store/commentManage/commentReducer';
import board from '@store/board/boardsReducer';
import seoMeta from '@store/seoMeta/seoMetaReducer';
import jpod from '@store/jpod/jpodReducer';
import poll from '@store/survey/poll/pollReducer';

export default combineReducers({
    comment,
    toastr,
    app,
    loading,
    layout,
    auth,
    article,
    rcvArticle,
    articleSource,
    photoArchive,
    bright,
    domain,
    code,
    codeMgt,
    reserved,
    page,
    articlePage,
    template,
    dataset,
    component,
    container,
    editForm,
    relation,
    history,
    menu,
    group,
    reporter,
    directLink,
    area,
    desking,
    merge,
    member,
    columnist,
    sns,
    bulks,
    special,
    board,
    seoMeta,
    poll,
    jpod,
});
