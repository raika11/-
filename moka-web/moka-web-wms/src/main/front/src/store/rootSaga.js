import { all } from 'redux-saga/effects';

import appSaga from '@store/app/appSaga';
import authSaga from '@store/auth/authSaga';
import articleSaga from '@store/article/articleSaga';
import rcvArticleSaga from '@store/rcvArticle/rcvArticleSaga';
import articleSourceSaga from '@store/articleSource/articleSourceSaga';
import domainSaga from '@store/domain/domainSaga';
import templateSaga from '@store/template/templateSaga';
import codeSaga from '@store/code/codeSaga';
import codeMgtSaga from '@store/codeMgt/codeMgtSaga';
import reservedSaga from '@store/reserved/reservedSaga';
import datasetdSaga from '@store/dataset/datasetSaga';
import componentSaga from '@store/component/componentSaga';
import containerSaga from '@store/container/containerSaga';
import pageSaga from '@store/page/pageSaga';
import editFormSaga from '@/store/editForm/editFormSaga';
import relationSaga from '@store/relation/relationSaga';
import historySaga from '@store/history/historySaga';
import menuSaga from '@store/menu/menuSaga';
import mergeSaga from '@store/merge/mergeSaga';
import areaSaga from '@store/area/areaSaga';
import groupSaga from '@store/group/groupSaga';
import reporterSaga from '@store/reporter/reporterSaga';
import deskingSaga from '@store/desking/deskingSaga';
import memberSaga from '@store/member/memberSaga';
import directLinkSaga from '@store/directLink/directLinkSaga';
import columnistSaga from '@store/columnist/columnistSaga';
import photoArchiveSaga from '@store/photoArchive/photoArchiveSaga';
import articlePageSaga from '@/store/articlePage/articlePageSaga';
import snsSaga from '@store/snsManage/snsSaga';
import brightSaga from '@store/bright/brightSaga';
import bulksSaga from '@store/bulks/bulksSaga';
import specialSaga from '@store/special/specialSaga';
import commentSaga from '@store/commentManage/commentSaga';
import boardSaga from '@store/board/boardsSaga';
import seoMetaSaga from '@store/seoMeta/seoMetaSaga';
import jpodSaga from '@store/jpod/jpodSaga';
import pollSaga from '@store/survey/poll/pollSaga';
import cdnArticleSaga from '@store/cdnArticle/cdnArticleSaga';
import internalApiSaga from '@store/internalApi/internalApiSaga';
import tourSaga from '@store/tour/tourSaga';
import editLogSaga from '@store/editLog/editLogSaga';

export default function* rootSaga() {
    yield all([
        appSaga(),
        authSaga(),
        articleSaga(),
        rcvArticleSaga(),
        articleSourceSaga(),
        domainSaga(),
        templateSaga(),
        codeSaga(),
        codeMgtSaga(),
        reservedSaga(),
        datasetdSaga(),
        componentSaga(),
        containerSaga(),
        pageSaga(),
        areaSaga(),
        editFormSaga(),
        relationSaga(),
        historySaga(),
        mergeSaga(),
        menuSaga(),
        groupSaga(),
        reporterSaga(),
        deskingSaga(),
        memberSaga(),
        directLinkSaga(),
        columnistSaga(),
        photoArchiveSaga(),
        articlePageSaga(),
        snsSaga(),
        brightSaga(),
        bulksSaga(),
        specialSaga(),
        commentSaga(),
        boardSaga(),
        seoMetaSaga(),
        jpodSaga(),
        pollSaga(),
        cdnArticleSaga(),
        internalApiSaga(),
        tourSaga(),
        editLogSaga(),
    ]);
}
