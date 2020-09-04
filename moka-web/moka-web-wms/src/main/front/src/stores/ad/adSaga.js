import { takeLatest } from 'redux-saga/effects';
import { callApiAfterActions } from '~/stores/@common/createSaga';
import * as adStore from './adStore';
import * as api from '~/stores/api/adAPI';

/**
 * 목록 조회
 */
export const getAdsSaga = callApiAfterActions(
    adStore.GET_ADS,
    api.getAds,
    (state) => state.adStore
);

export default function* adSaga() {
    yield takeLatest(adStore.GET_ADS, getAdsSaga);
}
