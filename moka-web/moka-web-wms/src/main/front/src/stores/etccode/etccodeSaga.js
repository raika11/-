import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import * as etccodeAPI from '~/stores/api/etccodeAPI';
import createRequestSaga from '~/stores/@common/createRequestSaga';
import * as etccodeStore from './etccodeStore';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';

let defaultMessage = {
    key: `etccode${new Date().getTime() + Math.random()}`,
    message: '처리도중 에러가 발생했습니다.',
    options: {
        variant: 'error',
        persist: true
    }
};

/**
 * saga
 */
const getEtccodeListSaga = createRequestSaga(
    etccodeStore.GET_ETCCODE_LIST,
    etccodeAPI.getEtccodeList
);

/**
 * 저장/수정
 * @param {object} param0 payload
 */
export function* putEtccodeListSaga({ payload: { actions, callback } }) {
    defaultMessage.key = `etccode${new Date().getTime() + Math.random()}`;
    let ACTION = etccodeStore.PUT_ETCCODE;

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
        const edit = yield select((state) => state.etccodeStore.edit);

        let response;
        if (edit.seq) {
            response = yield call(etccodeAPI.putEtccode, { etccode: edit });
        } else {
            response = yield call(etccodeAPI.postEtccode, { etccode: edit });
        }

        if (response.data.header.success) {
            yield put({
                type: etccodeStore.PUT_ETCCODE_SUCCESS,
                payload: response.data
            });

            defaultMessage.message = edit.seq ? '수정하였습니다' : '등록하였습니다';
            defaultMessage.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({
                type: etccodeStore.GET_ETCCODE_LIST,
                payload: { codeTypeId: edit.codeTypeId }
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        } else {
            yield put({
                type: etccodeStore.PUT_ETCCODE_FAILURE,
                payload: response.data,
                error: true
            });

            defaultMessage.message = response.data.body.list[0].reason;

            // 목록 다시 검색
            yield put({
                type: etccodeStore.GET_ETCCODE_LIST,
                payload: edit.codeTypeId
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        }
    } catch (e) {
        yield put({
            type: etccodeStore.PUT_ETCCODE_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));
    // 메세지박스 노출
    yield put(enqueueSnackbar(defaultMessage));
}

/**
 * 코드 삭제
 * @param {number} param0.payload.etccodeSeq 코드 아이디
 * @param {function} param0.payload.callback 콜백
 */
export function* deleteEtccodeSaga({ payload: { codeSet, callback } }) {
    let resultObj = {
        key: `etccodeDel${new Date().getTime()}`,
        message: '삭제하지 못했습니다',
        options: { variant: 'error', persist: true }
    };

    const ACTION = etccodeStore.DELETE_ETCCODE;
    yield put(startLoading(ACTION));
    try {
        const response = yield call(etccodeAPI.deleteEtccode, codeSet.seq);

        if (response.data.header.success) {
            yield put({
                type: etccodeStore.DELETE_ETCCODE_SUCCESS,
                payload: response.data
            });
            resultObj.message = '삭제하였습니다';
            resultObj.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({
                type: etccodeStore.GET_ETCCODE_LIST,
                payload: { ...codeSet }
            });
            // 콜백 실행
            if (typeof callback === 'function') {
                yield call(callback, response.data.body);
            }
        } else {
            yield put({
                type: etccodeStore.DELETE_ETCCODE_FAILURE,
                payload: response.data
            });

            defaultMessage.message = response.data.body.list[0].reason;
        }
    } catch (e) {
        yield put({
            type: etccodeStore.DELETE_ETCCODE_FAILURE,
            payload: e
        });
    }
    yield put(finishLoading(ACTION));
    // 메세지박스 노출
    yield put(enqueueSnackbar(resultObj));
}

export default function* etccodeSaga() {
    yield takeLatest(etccodeStore.GET_ETCCODE_LIST, getEtccodeListSaga);
    yield takeLatest(etccodeStore.PUT_ETCCODE, putEtccodeListSaga);
    yield takeLatest(etccodeStore.DELETE_ETCCODE, deleteEtccodeSaga);
}
