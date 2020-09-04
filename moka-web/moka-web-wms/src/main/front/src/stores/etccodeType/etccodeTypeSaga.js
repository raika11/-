import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import { callApiAfterActions } from '~/stores/@common/createSaga';
import {
    CODETYPE_LANG,
    CODETYPE_SERVICE_TYPE,
    CODETYPE_PAGE_TYPE,
    CODETYPE_TP_SIZE,
    CODETYPE_TP_ZONE,
    CODETYPE_API
} from '~/constants';
import * as api from '~/stores/api/etccodeAPI';
import * as etccodeTypeStore from './etccodeTypeStore';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';

let defaultMessage = {
    key: `etccodeTypeSave${new Date().getTime() + Math.random()}`,
    message: '처리도중 에러가 발생했습니다.',
    options: {
        variant: 'error',
        persist: true
    }
};

/**
 * 코드타입 목록 조회
 */
export function* getEtccodeTypeListSaga({ payload }) {
    const etc = callApiAfterActions(
        etccodeTypeStore.GET_ETCCODETYPE,
        api.getEtccodeTypeList,
        (state) => state.etccodeTypeStore
    );

    yield call(etc, { payload });
}

/**
 * read only 데이터 조회
 */
function callROCApi(actionType, rowName, param) {
    return function* () {
        yield put(startLoading(actionType));
        try {
            const response = yield call(api.getEtccodeList, param);
            if (response.data.header.success) {
                yield put({
                    type: etccodeTypeStore.READ_ONLY_SUCCESS,
                    payload: {
                        rowName,
                        body: response.data.body
                    }
                });
            } else {
                yield put({
                    type: etccodeTypeStore.READ_ONLY_FAILURE,
                    payload: { rowName }
                });
            }
        } catch (e) {
            yield put({
                type: etccodeTypeStore.READ_ONLY_FAILURE,
                payload: { rowName }
            });
        }
        yield put(finishLoading(actionType));
    };
}
export const getTpSizeSaga = callROCApi(
    etccodeTypeStore.GET_TP_SIZE,
    'tpSizeRows',
    CODETYPE_TP_SIZE
);
export const getTpZoneSaga = callROCApi(
    etccodeTypeStore.GET_TP_ZONE,
    'tpZoneRows',
    CODETYPE_TP_ZONE
);
export const getLangSaga = callROCApi(etccodeTypeStore.GET_LANG, 'langRows', CODETYPE_LANG);
export const getServiceTypeSaga = callROCApi(
    etccodeTypeStore.GET_SERVICE_TYPE,
    'serviceTypeRows',
    CODETYPE_SERVICE_TYPE
);
export const getPageTypeSaga = callROCApi(
    etccodeTypeStore.GET_SERVICE_TYPE,
    'pageTypeRows',
    CODETYPE_PAGE_TYPE
);
export const getApiSaga = callROCApi(etccodeTypeStore.GET_API, 'apiRows', CODETYPE_API);

/**
 * 저장/수정
 * @param {object} param0 payload
 */
export function* saveEtccodeTypeSaga({ payload: { actions, callback } }) {
    defaultMessage.key = `etccodeTypeSave${new Date().getTime() + Math.random()}`;

    let ACTION = etccodeTypeStore.PUT_ETCCODETYPE;
    yield put(startLoading(ACTION));
    try {
        // 검색 전에 배열로 들어온 액션들을 먼저 실행시킨다
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload
                });
            }
        }
        const edit = yield select((state) => state.etccodeTypeStore.edit);

        let response;
        if (edit.codeTypeSeq) {
            response = yield call(api.putEtccodeType, { etccodeType: edit });
        } else {
            response = yield call(api.postEtccodeType, { etccodeType: edit });
        }

        if (response.data.header.success) {
            yield put({
                type: etccodeTypeStore.PUT_ETCCODETYPE_SUCCESS,
                payload: response.data
            });
            defaultMessage.message = edit.codeTypeSeq ? '수정하였습니다' : '등록하였습니다';
            defaultMessage.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({
                type: etccodeTypeStore.GET_ETCCODETYPE
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        } else {
            yield put({
                type: etccodeTypeStore.PUT_ETCCODETYPE_FAILURE,
                payload: response.data,
                error: true
            });

            defaultMessage.message = response.data.body.list[0].reason;

            // 목록 다시 검색
            yield put({
                type: etccodeTypeStore.GET_ETCCODETYPE
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        }
    } catch (e) {
        yield put({
            type: etccodeTypeStore.PUT_ETCCODETYPE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));

    // 메세지박스 노출
    yield put(enqueueSnackbar(defaultMessage));
}

/**
 * 코드그룹 삭제
 * @param {number} param0.payload.etccodeTypeSeq 코드타입 아이디
 * @param {function} param0.payload.callback 콜백
 */
export function* deleteEtccodeTypeSaga({ payload: { codeTypeSeq, callback } }) {
    let resultObj = {
        key: `etccodeTypeDel${new Date().getTime()}`,
        message: '삭제하지 못했습니다',
        options: { variant: 'error', persist: true }
    };

    const ACTION = etccodeTypeStore.DELETE_ETCCODETYPE;
    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteEtccodeType, codeTypeSeq);

        if (response.data.header.success) {
            yield put({
                type: etccodeTypeStore.DELETE_ETCCODETYPE_SUCCESS,
                payload: response.data
            });
            resultObj.message = '삭제하였습니다';
            resultObj.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({
                type: etccodeTypeStore.GET_ETCCODETYPE
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        } else {
            yield put({
                type: etccodeTypeStore.DELETE_ETCCODETYPE_FAILURE,
                payload: response.data
            });

            defaultMessage.message = response.data.body.list[0].reason;
        }
    } catch (e) {
        yield put({
            type: etccodeTypeStore.DELETE_ETCCODETYPE_FAILURE,
            payload: e
        });
    }
    yield put(finishLoading(ACTION));
    // 메세지박스 노출
    yield put(enqueueSnackbar(resultObj));
}

/**
 * saga
 */
export default function* etccodeTypeSaga() {
    yield takeLatest(etccodeTypeStore.GET_ETCCODETYPE, getEtccodeTypeListSaga);
    yield takeLatest(etccodeTypeStore.PUT_ETCCODETYPE, saveEtccodeTypeSaga);
    yield takeLatest(etccodeTypeStore.DELETE_ETCCODETYPE, deleteEtccodeTypeSaga);

    yield takeLatest(etccodeTypeStore.GET_TP_SIZE, getTpSizeSaga);
    yield takeLatest(etccodeTypeStore.GET_TP_ZONE, getTpZoneSaga);
    yield takeLatest(etccodeTypeStore.GET_LANG, getLangSaga);
    yield takeLatest(etccodeTypeStore.GET_SERVICE_TYPE, getServiceTypeSaga);
    yield takeLatest(etccodeTypeStore.GET_PAGE_TYPE, getPageTypeSaga);
    yield takeLatest(etccodeTypeStore.GET_API, getApiSaga);
}
