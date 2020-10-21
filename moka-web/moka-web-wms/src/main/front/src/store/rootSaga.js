import { all } from 'redux-saga/effects';

import authSaga from '@store/auth/authSaga';
import domainSaga from '@store/domain/domainSaga';
import templateSaga from '@store/template/templateSaga';
import codeMgtSaga from '@store/codeMgt/codeMgtSaga';
import reservedSaga from '@store/reserved/reservedSaga';

export default function* rootSaga() {
    yield all([authSaga(), domainSaga(), templateSaga(), codeMgtSaga(), reservedSaga()]);
}
