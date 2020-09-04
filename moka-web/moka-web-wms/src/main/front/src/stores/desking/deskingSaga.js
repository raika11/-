import { call, put, select, takeLatest } from 'redux-saga/effects';
import produce from 'immer';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as authStore from '../auth/authStore';
import * as deskingStore from './deskingStore';
import * as deskingHistoryStore from './deskingHistoryStore';
import * as deskingAPI from '~/stores/api/deskingAPI';
import * as gridStore from './gridStore';

/**
 * 다이렉트 로딩시 도메인 수정
 * @param {} page 조회된 객체
 */
function* changeDomainId(page) {
    const latestMediaId = yield select((state) => state.authStore.latestMediaId);
    const latestDomainId = yield select((state) => state.authStore.latestDomainId);
    const { mediaId: mId, domainId: dId } = page.domain;

    if (latestDomainId !== dId) {
        if (latestMediaId !== mId) {
            yield put({
                type: authStore.CHANGE_LATEST_MEDIAID,
                payload: { mediaId: mId, domainId: dId }
            });
        } else {
            yield put({
                type: authStore.CHANGE_LATEST_DOMAINID,
                payload: dId
            });
        }
    }
}

/**
 * 페이지클릭시, Work 초기화 및 Work 컴포넌트 목록 조회
 */
function* getComponentWorkListSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '컴포넌트 목록을 조회하지 못했습니다.',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { pageSeq, direct = false, callback } = action.payload;

    yield put(startLoading(deskingStore.GET_COMPONENT_WORK_LIST)); // 로딩 시작
    try {
        // 검색조건 변경
        const currentSearch = yield select((state) => state.deskingStore.search);
        if (currentSearch.pageSeq !== pageSeq) {
            const search = produce(currentSearch, (draft) => {
                draft.pageSeq = pageSeq;
            });
            yield put({
                type: deskingStore.CHANGE_SEARCH_OPTION,
                payload: search
            });
        }

        // 조회
        const response = yield call(deskingAPI.getComponentWorkList, pageSeq);

        if (response.data.header.success) {
            yield put({
                type: deskingStore.GET_COMPONENT_WORK_LIST_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '조회하였습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data;

            // direct로딩시 latestMediaId, latestDomainId수정
            if (direct) {
                yield* changeDomainId(response.data.body.page);
            }
            // grid초기화
            yield put({
                type: gridStore.CLEAR_GRID,
                payload: null
            });
        } else {
            yield put({
                type: deskingStore.GET_COMPONENT_WORK_LIST_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.GET_COMPONENT_WORK_LIST_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.GET_COMPONENT_WORK_LIST)); // 로딩 끝

    // 메세지박스 노출
    if (resultMessage.options.variant === 'error') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * Work컴포넌트 상세조회
 */
function* getComponentWorkSaga(action) {
    let resultMessage = {
        key: `component${new Date().getTime() + Math.random()}`,
        message: '컴포넌트를 조회하지 못했습니다.',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { componentWorkSeq, callback } = action.payload;

    yield put(startLoading(deskingStore.GET_COMPONENT_WORK)); // 로딩 시작
    try {
        const response = yield call(deskingAPI.getComponentWork, componentWorkSeq);
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '조회하였습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.GET_COMPONENT_WORK)); // 로딩 끝

    // 메세지박스 노출
    if (resultMessage.options.variant === 'error') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 컴포넌트 전송
 * @param {} action
 */
function* postComponentWorkSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '전송하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { componentWorkSeq, callback } = action.payload;
    yield put(startLoading(deskingStore.POST_COMPONENT_WORK)); // 로딩 시작
    try {
        // 1. 페이지 등록
        const response = yield call(deskingAPI.postComponentWork, componentWorkSeq);
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '전송되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.POST_COMPONENT_WORK)); // 로딩 끝

    // 메세지박스 노출
    yield put(enqueueSnackbar(resultMessage));

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 컴포넌트워크 수정
 * @param {} action
 */
function* putComponentWorkSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '작업자용 컴포넌트정보를 수정하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { callback } = action.payload;
    yield put(startLoading(deskingStore.PUT_COMPONENT_WORK)); // 로딩 시작
    try {
        // 1. 수정
        const response = yield call(deskingAPI.putComponentWork, action.payload);
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '수정되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.PUT_COMPONENT_WORK)); // 로딩 끝

    // 메세지박스 노출 : 성공하지 못했을 경우만 노출
    if (resultMessage.options.variant !== 'success') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 다른사람이 저장했는지 조사
 */
export function* hasOtherSavedSaga(action) {
    const { componentWorkSeq, datasetSeq, callback } = action.payload;
    yield put(startLoading(deskingStore.HAS_OTHER_SAVED));
    try {
        const result = yield call(deskingAPI.hasOtherSaved, { componentWorkSeq, datasetSeq });
        if (result.data.header.success && typeof callback === 'function') {
            yield call(callback, result.data.body);
        }
    } catch (e) {
        if (typeof callback === 'function') {
            yield call(callback, false);
        }
    }
    yield put(finishLoading(deskingStore.HAS_OTHER_SAVED));
}

/*
 * Work컴포넌트 순번 수정
 */
function* putDeskingWorkPrioritySaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '순서를 변경하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    const { component, callback } = action.payload;

    yield put(startLoading(deskingStore.PUT_DESKING_WORK_PRIORITY)); // 로딩 시작
    try {
        // 1. 수정
        const response = yield call(deskingAPI.putDeskingWorkPriority, { component });
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '수정되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.PUT_DESKING_WORK_PRIORITY)); // 로딩 끝

    // 메세지박스 노출 : 성공하지 못했을 경우만 노출
    if (resultMessage.options.variant !== 'success') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * Work 편집기사 추가
 * @param {} action
 */
export function* postDeskingWorkSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '편집기사로 추가하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    const { componentWorkSeq, datasetSeq, deskingWork, callback, success } = action.payload;
    yield put(startLoading(deskingStore.POST_DESKING_WORK)); // 로딩 시작
    try {
        // 1. 추가
        const response = yield call(deskingAPI.postDeskingWork, {
            componentWorkSeq,
            datasetSeq,
            deskingWork
        });
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '추가되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.POST_DESKING_WORK)); // 로딩 끝

    // 메세지박스 노출 : 성공하지 못했을 경우만 노출
    if (resultMessage.options.variant !== 'success') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * Work 편집기사 목록 추가
 * @param {} action
 */
export function* postDeskingWorkListSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '편집기사로 추가하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    const { componentWorkSeq, datasetSeq, list, callback } = action.payload;
    yield put(startLoading(deskingStore.POST_DESKING_WORK_LIST)); // 로딩 시작
    try {
        // 1. 추가
        const response = yield call(deskingAPI.postDeskingWorkList, {
            componentWorkSeq,
            datasetSeq,
            list
        });
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '추가되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.POST_DESKING_WORK_LIST)); // 로딩 끝

    // 메세지박스 노출 : 성공하지 못했을 경우만 노출
    if (resultMessage.options.variant !== 'success') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * Work 편집기사 목록 이동
 * @param {} action
 */
export function* moveDeskingWorkListSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '이동하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    debugger;
    const { srcComponentWorkSeq, callback } = action.payload;
    yield put(startLoading(deskingStore.MOVE_DESKING_WORK_LIST)); // 로딩 시작
    try {
        // 1. 이동
        const response = yield call(deskingAPI.moveDeskingWorkList, action.payload);
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '이동되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;

            // source 컴포넌트 재조회
            yield put({
                type: deskingStore.GET_COMPONENT_WORK,
                payload: {
                    componentWorkSeq: srcComponentWorkSeq
                }
            });
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.POST_DESKING_WORK)); // 로딩 끝

    // 메세지박스 노출 : 성공하지 못했을 경우만 노출
    if (resultMessage.options.variant !== 'success') {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 편집기사(데스킹) 워크 수정
 * @param {object} param0.payload
 */
function* putDeskingWorkSaga({ payload }) {
    let message = {};
    message.key = 'putDeskingWork';
    message.message = '편집화면 데이터를 저장하지 못했습니다.';
    message.options = {};
    message.options.variant = 'error';

    const { componentWorkSeq, deskingWork, success, fail } = payload;

    yield put(startLoading(deskingStore.PUT_DESKING_WORK));
    try {
        // 데스킹 워크 수정
        const response = yield call(deskingAPI.putDeskingWork, {
            deskingWork,
            componentWorkSeq
        });
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            message.message = '저장하였습니다';
            message.options.variant = 'success';
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            if (typeof fail === 'function') yield call(fail);
        }
    } catch (e) {
        // onError
        if (typeof fail === 'function') yield call(fail);
    }

    yield put(enqueueSnackbar(message));
    yield put(finishLoading(deskingStore.PUT_DESKING_WORK));
}

/**
 * 데스킹워크의 관련기사(목록) 저장
 * @param {object} param0.payload payload
 */
function* putDeskingRelWorksSaga({ payload }) {
    let message = {};
    message.key = 'putDeskingRelWork';
    message.message = '관련기사를 저장하지 못했습니다.';
    message.options = {};
    message.options.variant = 'error';

    const { componentWorkSeq, deskingWork, deskingRelWorks, success, fail } = payload;

    yield put(startLoading(deskingStore.PUT_DESKING_REL_WORKS));
    try {
        const response = yield call(deskingAPI.putDeskingRelWorks, {
            componentWorkSeq,
            deskingWork,
            deskingRelWorks
        });

        if (response.data.header.success) {
            message.options.variant = 'success';
            // 데스킹워크 목록 조회(단건)
            yield put({
                type: deskingStore.GET_COMPONENT_WORK,
                payload: { componentWorkSeq }
            });
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            message.message = response.data.header.message;
            if (typeof fail === 'function') yield call(fail);
        }
    } catch (e) {
        // 에러 발생
        if (typeof fail === 'function') yield call(fail);
    }

    if (message.options.variant === 'error') yield put(enqueueSnackbar(message));
    yield put(finishLoading(deskingStore.PUT_DESKING_REL_WORKS));
}

/**
 * 데스킹워크의 관련기사 삭제
 * @param {object} param0.payload payload
 */
function* deleteDeskingRelWorkSaga({ payload }) {
    let message = {};
    message.key = 'delDeskingRelWork';
    message.message = '관련기사를 삭제하지 못했습니다.';
    message.options = {};
    message.options.variant = 'error';
    yield put(startLoading(deskingStore.DELETE_DESKING_REL_WORK));

    try {
        const { componentWorkSeq, deskingWork, deskingRelWork, success } = payload;
        const response = yield call(deskingAPI.deleteDeskingRelWork, {
            componentWorkSeq,
            deskingWork,
            deskingRelWork
        });

        if (response.data.header.success) {
            message.options.variant = 'success';
            // 데스킹워크 목록 조회(단건)
            yield put({
                type: deskingStore.GET_COMPONENT_WORK,
                payload: { componentWorkSeq }
            });
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            message.message = response.data.header.message;
        }
    } catch (e) {
        // 에러
    }

    if (message.options.variant === 'error') yield put(enqueueSnackbar(message));
    yield put(finishLoading(deskingStore.DELETE_DESKING_REL_WORK));
}

/**
 * work편집기사 삭제
 * @param {} action
 */
export function* deleteDeskingWorkListSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '삭제하지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = false;
    const { componentWorkSeq, datasetSeq, list, noMessage = false, callback } = action.payload;
    yield put(startLoading(deskingStore.DELETE_DESKING_WORK_LIST)); // 로딩 시작
    try {
        // 1. 삭제
        const response = yield call(deskingAPI.deleteDeskingWorkList, {
            componentWorkSeq,
            datasetSeq,
            list
        });
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '삭제되었습니다';
            resultMessage.options = { variant: 'success' };
            result = true;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingStore.DELETE_DESKING_WORK_LIST)); // 로딩 끝

    // 메세지박스 노출
    if (!noMessage) {
        yield put(enqueueSnackbar(resultMessage));
    }

    // 콜백
    if (typeof callback === 'function') yield call(callback, result);
}

/**
 * 히스토리 조회(그룹, 상세)
 */
const createHistSaga = (action, api, selector) => {
    const SUCCESS = `${action}_SUCCESS`;
    const FAILURE = `${action}_FAILURE`;
    return function* ({ payload }) {
        const { actions, componentWorkSeq, pageSeq } = payload;
        try {
            if (actions && actions.length > 0) {
                for (let i = 0; i < actions.length; i++) {
                    const act = actions[i];
                    if (act) {
                        yield put({
                            type: act.type,
                            payload: act.payload
                        });
                    }
                }
            }
            yield put(startLoading(action));
            const search = yield select(selector);
            const response = yield call(api, {
                componentWorkSeq,
                pageSeq,
                search
            });
            if (response.data.header.success) {
                yield put({ type: SUCCESS, payload: response.data });
            } else {
                yield put({ type: FAILURE });
            }
        } catch (e) {
            yield put({ type: FAILURE });
        }
        yield put(finishLoading(action));
    };
};

function* getDeskingHistGroupSaga({ payload }) {
    const sagaFunc = createHistSaga(
        deskingHistoryStore.GET_DESKING_HISTORIES_GROUP,
        deskingAPI.getDeskingHistories,
        (store) => store.deskingHistoryStore.group.search
    );
    yield call(sagaFunc, { payload });
}

function* getDeskingHistSaga({ payload }) {
    const sagaFunc = createHistSaga(
        deskingHistoryStore.GET_DESKING_HISTORIES,
        deskingAPI.getDeskingHistories,
        (store) => store.deskingHistoryStore.detail.search
    );
    yield call(sagaFunc, { payload });
}

function* getAllDeskingHistGroupSaga({ payload }) {
    const sagaFunc = createHistSaga(
        deskingHistoryStore.GET_ALL_DESKING_HISTORIES_GROUP,
        deskingAPI.getAllDeskingHistoriesGroup,
        (store) => store.deskingHistoryStore.allGroup.search
    );
    yield call(sagaFunc, { payload });
}

function* getAllDeskingHistSaga({ payload }) {
    const sagaFunc = createHistSaga(
        deskingHistoryStore.GET_ALL_DESKING_HISTORIES,
        deskingAPI.getAllDeskingHistories,
        (store) => store.deskingHistoryStore.allDetail.search
    );
    yield call(sagaFunc, { payload });
}

function* postDeskingHistoriesSaga(action) {
    let resultMessage = {
        key: `desking${new Date().getTime() + Math.random()}`,
        message: '히스토리를 불러오지 못했습니다!',
        options: { variant: 'error', persist: true }
    };
    let result = null;
    yield put(startLoading(deskingHistoryStore.POST_DESKING_HISTORIES)); // 로딩 시작
    try {
        // 1. 불러오기
        const response = yield call(deskingAPI.postDeskingHistories, action.payload);
        if (response.data.header.success) {
            yield put({
                type: deskingStore.COMPONENT_WORK_SUCCESS,
                payload: response.data
            });
            resultMessage.message = '수정되었습니다';
            resultMessage.options = { variant: 'success' };
            result = response.data.body;
        } else {
            yield put({
                type: deskingStore.COMPONENT_WORK_FAILURE,
                payload: response.data,
                error: true
            });
            if (response.data && response.data.header.message) {
                resultMessage.message = response.data.header.message;
            }
        }
    } catch (e) {
        yield put({
            type: deskingStore.COMPONENT_WORK_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(deskingHistoryStore.POST_DESKING_HISTORIES)); // 로딩 끝

    // 메세지박스 노출 : 성공하지 못했을 경우만 노출
    if (resultMessage.options.variant !== 'success') {
        yield put(enqueueSnackbar(resultMessage));
    }
}

// saga watcher
function* deskingSaga() {
    yield takeLatest(deskingStore.GET_COMPONENT_WORK_LIST, getComponentWorkListSaga);
    yield takeLatest(deskingStore.GET_COMPONENT_WORK, getComponentWorkSaga);
    yield takeLatest(deskingStore.POST_COMPONENT_WORK, postComponentWorkSaga);
    yield takeLatest(deskingStore.PUT_COMPONENT_WORK, putComponentWorkSaga);
    yield takeLatest(deskingStore.HAS_OTHER_SAVED, hasOtherSavedSaga);
    yield takeLatest(deskingStore.PUT_DESKING_WORK_PRIORITY, putDeskingWorkPrioritySaga);
    yield takeLatest(deskingStore.POST_DESKING_WORK, postDeskingWorkSaga);
    yield takeLatest(deskingStore.POST_DESKING_WORK_LIST, postDeskingWorkListSaga);
    yield takeLatest(deskingStore.MOVE_DESKING_WORK_LIST, moveDeskingWorkListSaga);
    yield takeLatest(deskingStore.PUT_DESKING_WORK, putDeskingWorkSaga);
    yield takeLatest(deskingStore.PUT_DESKING_REL_WORKS, putDeskingRelWorksSaga);
    yield takeLatest(deskingStore.DELETE_DESKING_WORK_LIST, deleteDeskingWorkListSaga);
    yield takeLatest(deskingStore.DELETE_DESKING_REL_WORK, deleteDeskingRelWorkSaga);

    // 히스토리 관련
    yield takeLatest(deskingHistoryStore.GET_DESKING_HISTORIES_GROUP, getDeskingHistGroupSaga);
    yield takeLatest(deskingHistoryStore.GET_DESKING_HISTORIES, getDeskingHistSaga);
    yield takeLatest(
        deskingHistoryStore.GET_ALL_DESKING_HISTORIES_GROUP,
        getAllDeskingHistGroupSaga
    );
    yield takeLatest(deskingHistoryStore.GET_ALL_DESKING_HISTORIES, getAllDeskingHistSaga);
    yield takeLatest(deskingHistoryStore.POST_DESKING_HISTORIES, postDeskingHistoriesSaga);
}

export default deskingSaga;
