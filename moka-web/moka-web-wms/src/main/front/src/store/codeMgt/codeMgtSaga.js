import { call, put, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { CODETYPE_LANG, CODETYPE_SERVICE_TYPE, CODETYPE_PAGE_TYPE, CODETYPE_TP_SIZE, CODETYPE_TP_ZONE, CODETYPE_API } from '@/constants';

import * as api from './codeMgtApi';
import * as act from './codeMgtAction';

/**
 * 조회용 데이터 사가 생성함수
 * @param {string} actionType 액션명
 * @param {string} rowName initialState의 key 명칭
 * @param {string} grpCd grpCd
 */
function createReadOnlySaga(actionType, rowName, grpCd) {
    return function* () {
        yield put(startLoading(actionType));
        try {
            const response = yield call(api.getUseCodeMgtList, grpCd);
            if (response.data.header.success) {
                yield put({
                    type: act.READ_ONLY_SUCCESS,
                    payload: {
                        rowName,
                        body: response.data.body,
                    },
                });
            } else {
                yield put({
                    type: act.READ_ONLY_FAILURE,
                    payload: { rowName },
                });
            }
        } catch (e) {
            yield put({
                type: act.READ_ONLY_FAILURE,
                payload: { rowName },
            });
        }
        yield put(finishLoading(actionType));
    };
}
export const getTpSize = createReadOnlySaga(act.GET_TP_SIZE, 'tpSizeRows', CODETYPE_TP_SIZE);
export const getTpZone = createReadOnlySaga(act.GET_TP_ZONE, 'tpZoneRows', CODETYPE_TP_ZONE);
export const getLang = createReadOnlySaga(act.GET_LANG, 'langRows', CODETYPE_LANG);
export const getServiceType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'serviceTypeRows', CODETYPE_SERVICE_TYPE);
export const getPageType = createReadOnlySaga(act.GET_SERVICE_TYPE, 'pageTypeRows', CODETYPE_PAGE_TYPE);
export const getApi = createReadOnlySaga(act.GET_API, 'apiRows', CODETYPE_API);

/** saga */
export default function* codeMgt() {
    yield takeLatest(act.GET_TP_SIZE, getTpSize);
    yield takeLatest(act.GET_TP_ZONE, getTpZone);
    yield takeLatest(act.GET_LANG, getLang);
    yield takeLatest(act.GET_SERVICE_TYPE, getServiceType);
    yield takeLatest(act.GET_PAGE_TYPE, getPageType);
    yield takeLatest(act.GET_API, getApi);
}
