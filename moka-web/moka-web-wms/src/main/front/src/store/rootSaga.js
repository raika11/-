import { all } from 'redux-saga/effects';

import appSaga from '@store/app/appSaga';
import authSaga from '@store/auth/authSaga';
import domainSaga from '@store/domain/domainSaga';
import templateSaga from '@store/template/templateSaga';
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
import reporter from '@store/reporter/reporterSaga';

export default function* rootSaga() {
    yield all([
        appSaga(),
        authSaga(),
        domainSaga(),
        templateSaga(),
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
        reporter(),
    ]);
}
