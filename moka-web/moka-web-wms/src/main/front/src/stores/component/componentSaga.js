import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import createRequestSaga from '~/stores/@common/createRequestSaga';
import { callApiAfterActions } from '~/stores/@common/createSaga';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as api from '~/stores/api/componentAPI';
import * as componentStore from './componentStore';
import * as componentHistoryStore from './componentHistoryStore';
import * as componentRelationPGStore from './componentRelationPGStore';
import * as componentRelationCSStore from './componentRelationCSStore';
import * as componentRelationCTStore from './componentRelationCTStore';

/**
 * 목록 조회
 */
export const getComponentsSaga = callApiAfterActions(
    componentStore.GET_COMPONENTS,
    api.getComponents,
    (state) => state.componentStore
);

/**
 * 히스토리 목록 조회
 */
export const getHistoriesSaga = callApiAfterActions(
    componentHistoryStore.GET_HISTORIES,
    api.getHistories,
    (state) => state.componentHistoryStore
);

/**
 * 관련아이템 목록 조회
 * @param {string} param0.payload.type PG|CS|CT|CP
 * @param {array} param0.payload.actions api 호출 전 액션
 */
export function* getRelationsSaga({ payload }) {
    const { actions, relType } = payload;
    const actionType = `componentRelation${relType}Store/GET_RELATIONS`;

    const sagaFunc = callApiAfterActions(
        actionType,
        api.getRelations,
        (state) => state[`componentRelation${relType}Store`]
    );
    yield call(sagaFunc, { payload: actions });
}

/**
 * 조회
 */
export const getComponentSaga = createRequestSaga(componentStore.GET_COMPONENT, api.getComponent);

/**
 * 저장/수정
 * @param {array} param0.payload.actions 저장 전 액션리스트
 * @param {func} param0.payload.success 성공 콜백
 */
export function* saveComponentSaga({ payload: { actions, success } }) {
    let ACTION = componentStore.SAVE_COMPONENT;
    let message = {
        key: `componentSave${new Date().getTime()}`,
        message: '저장하지 못했습니다',
        options: { variant: 'error', persist: true }
    };
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
        const edit = yield select((state) => state.componentStore.edit);

        let response;
        if (edit.componentSeq) {
            response = yield call(api.putComponent, { component: edit });
        } else {
            response = yield call(api.postComponent, { component: edit });
        }

        if (response.data.header.success) {
            yield put({
                type: componentStore.GET_COMPONENT_SUCCESS,
                payload: response.data
            });
            message.message = edit.componentSeq ? '수정하였습니다' : '등록하였습니다';
            message.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({ type: componentStore.GET_COMPONENTS });
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            yield put({
                type: componentStore.GET_COMPONENT_FAILURE,
                payload: response.data
            });
        }
    } catch (e) {
        yield put({
            type: componentStore.GET_COMPONENT_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));

    // 메세지박스 노출
    yield put(enqueueSnackbar(message));
}

/**
 * 복사
 * @param {string|number} param0.payload.componentSeq 컴포넌트ID
 * @param {string} param0.payload.componentName 컴포넌트명
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
export function* copyComponentSaga({
    payload: { componentSeq, componentName, success, fail, error }
}) {
    const ACTION = componentStore.COPY_COMPONENT;
    let message = {
        key: `componentCopy${new Date().getTime()}`,
        message: '복사하지 못했습니다',
        options: { variant: 'error', persist: true }
    };
    yield put(startLoading(ACTION));
    try {
        const result = yield call(api.copyComponent, { componentSeq, componentName });
        if (result.data.header.success) {
            message.message = '복사하였습니다';
            message.options = { variant: 'success', persist: false };
            // 목록 다시 검색
            yield put({ type: componentStore.GET_COMPONENTS });
            if (typeof success === 'function') yield call(success, result.data.body);
        } else {
            if (typeof fail === 'function') yield call(fail, result.data.body);
        }
    } catch (e) {
        if (typeof error === 'function') yield call(error, e);
    }
    yield put(enqueueSnackbar(message));
}

/**
 * 여러개의 컴포넌트 한번에 저장
 * @param {array} param0.payload.components 컴포넌트리스트
 * @param {func} param0.payload.success 성공 콜백
 */
export function* postAllComponentsSaga({ payload: { components, success } }) {
    let ACTION = componentStore.POST_ALL_COMPONENTS;
    let message = {
        key: `componentSave${new Date().getTime()}`,
        message: '저장하지 못했습니다',
        options: { variant: 'error', persist: true }
    };
    yield put(startLoading(ACTION));
    try {
        if (components.length > 0) {
            // 컴포넌트 여러개 저장하는 api 호출
            let response = yield call(api.postAllComponents, { components });
            if (response.data.header.success) {
                message.message = '등록하였습니다. 컴포넌트관리 목록에서 확인하세요.';
                message.options = { variant: 'success', persist: false };
                if (typeof success === 'function') yield call(success, response.data.body);
            }
        } else {
            message.message = '등록할 컴포넌트가 없습니다';
        }
    } catch (e) {
        // 에러시 에러 메세지박스만 노출
    }
    yield put(finishLoading(ACTION));

    // 메세지박스 노출
    yield put(enqueueSnackbar(message));
}

/**
 * 관련 아이템 체크
 * @param {string|number} param0.payload.templateseq 컴포넌트ID (필수)
 * @param {func} param0.payload.exist 관련아이템 O 콜백
 * @param {func} param0.payload.notExist 관련아이템 X 콜백
 */
export function* hasRelationsSaga({ payload: { componentSeq, exist, notExist } }) {
    const ACTION = componentStore.HAS_RELATIONS;
    yield put(startLoading(ACTION));
    try {
        const result = yield call(api.hasRelations, { componentSeq });
        if (result.data.header.success) {
            if (result.data.body) {
                if (typeof exist === 'function') yield call(exist, true);
            } else {
                if (typeof notExist === 'function') yield call(notExist, false);
            }
        }
        // eslint-disable-next-line no-empty
    } catch (e) {}
    yield put(finishLoading(ACTION));
}

/**
 * 컴포넌트 삭제
 * @param {number} param0.payload.componentSeq 컴포넌트ID
 * @param {function} param0.payload.success 성공 콜백
 */
export function* deleteComponentSaga({ payload: { componentSeq, success } }) {
    let message = {
        key: `componentDel${new Date().getTime()}`,
        message: '삭제하지 못했습니다',
        options: { variant: 'error', persist: true }
    };
    const ACTION = componentStore.DELETE_COMPONENT;
    yield put(startLoading(ACTION));
    try {
        // 관련아이템 조회
        const hasRelations = yield call(api.hasRelations, { componentSeq });
        if (hasRelations.data.header.success) {
            if (hasRelations.data.body) {
                message.message = '관련아이템이 존재하여 삭제할 수 없습니다';
            } else {
                const response = yield call(api.deleteComponent, { componentSeq });

                if (response.data.header.success) {
                    yield put({
                        type: componentStore.DELETE_COMPONENT_SUCCESS,
                        payload: response.data
                    });
                    message.message = '삭제하였습니다';
                    message.options = { variant: 'success', persist: false };
                    // 목록 다시 검색
                    yield put({ type: componentStore.GET_COMPONENTS });
                    if (typeof success === 'function') yield call(success, response.data.body);
                } else {
                    // 컴포넌트 삭제 실패
                }
            }
        }
    } catch (e) {
        // 컴포넌트 삭제 에러
    }
    yield put(finishLoading(ACTION));
    yield put(enqueueSnackbar(message));
}

/**
 * 컴포넌트 데이터 초기화
 */
export function* clearComponentSaga({ payload }) {
    // 검색조건
    if (!payload || payload.search) {
        yield put({
            type: componentStore.CLEAR_SEARCH_OPTION
        });
    }
    // detail, edit
    if (!payload || payload.detail) {
        yield put({
            type: componentStore.CLEAR_COMPONENT_DETAIL
        });
    }
    // 리스트
    if (!payload || payload.list) {
        yield put({
            type: componentStore.CLEAR_COMPONENT_LIST
        });
    }
    // 관련아이템
    if (!payload || payload.relation) {
        yield put({
            type: componentRelationPGStore.CLEAR_RELATIONS
        });
        yield put({
            type: componentRelationCTStore.CLEAR_RELATIONS
        });
        yield put({
            type: componentRelationCSStore.CLEAR_RELATIONS
        });
    }
}

/**
 * saga
 */
export default function* componentSaga() {
    yield takeLatest(componentStore.GET_COMPONENTS, getComponentsSaga);
    yield takeLatest(componentStore.GET_COMPONENT, getComponentSaga);
    yield takeLatest(componentStore.CLEAR_COMPONENT, clearComponentSaga);
    yield takeLatest(componentStore.SAVE_COMPONENT, saveComponentSaga);
    yield takeLatest(componentStore.COPY_COMPONENT, copyComponentSaga);
    yield takeLatest(componentStore.POST_ALL_COMPONENTS, postAllComponentsSaga);
    yield takeLatest(componentStore.HAS_RELATIONS, hasRelationsSaga);
    yield takeLatest(componentStore.DELETE_COMPONENT, deleteComponentSaga);
    // 히스토리
    yield takeLatest(componentHistoryStore.GET_HISTORIES, getHistoriesSaga);
    // 관련아이템
    yield takeLatest(componentRelationPGStore.GET_RELATIONS, getRelationsSaga);
    yield takeLatest(componentRelationCSStore.GET_RELATIONS, getRelationsSaga);
    yield takeLatest(componentRelationCTStore.GET_RELATIONS, getRelationsSaga);
}
