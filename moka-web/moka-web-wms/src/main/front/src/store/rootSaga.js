import { all } from 'redux-saga/effects';

import authSaga from '@store/auth/authSaga';
import domainSaga from '@store/domain/domainSaga';

export default function* rootSaga() {
    yield all([authSaga(), domainSaga()]);
}
