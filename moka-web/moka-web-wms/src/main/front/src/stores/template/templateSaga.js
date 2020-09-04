import { call, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import createRequestSaga from '~/stores/@common/createRequestSaga';
import { callApiAfterActions } from '~/stores/@common/createSaga';
import * as api from '~/stores/api/templateAPI';
import * as templateStore from './templateStore';
import * as templateHistoryStore from './templateHistoryStore';
import * as templateRelationPGStore from './templateRelationPGStore';
import * as templateRelationCSStore from './templateRelationCSStore';
import * as templateRelationCTStore from './templateRelationCTStore';
import * as templateRelationCPStore from './templateRelationCPStore';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';

let message = {};

/**
 * 목록 조회
 */
export const getTemplatesSaga = callApiAfterActions(
    templateStore.GET_TEMPLATES,
    api.getTemplates,
    (state) => state.templateStore
);

/**
 * 히스토리 목록 조회
 */
export const getHistoriesSaga = callApiAfterActions(
    templateHistoryStore.GET_HISTORIES,
    api.getHistories,
    (state) => state.templateHistoryStore
);

/**
 * 관련아이템 목록 조회
 * @param {string} param0.payload.type PG|CS|CT|CP
 * @param {array} param0.payload.actions api 호출 전 액션
 */
export function* getRelationsSaga({ payload }) {
    const { actions, relType } = payload;
    const actionType = `templateRelation${relType}Store/GET_RELATIONS`;

    const sagaFunc = callApiAfterActions(
        actionType,
        api.getRelations,
        (state) => state[`templateRelation${relType}Store`]
    );
    yield call(sagaFunc, { payload: actions });
}

/**
 * 조회
 */
export const getTemplateSaga = createRequestSaga(templateStore.GET_TEMPLATE, api.getTemplate);

/**
 * 관련 아이템 체크
 * @param {string|number} param0.payload.templateseq 템플릿ID (필수)
 * @param {func} param0.payload.exist 관련아이템 O 콜백
 * @param {func} param0.payload.notExist 관련아이템 X 콜백
 */
export function* hasRelationSaga({ payload: { templateSeq, exist, notExist } }) {
    const ACTION = templateStore.HAS_RELATIONS;
    yield put(startLoading(ACTION));

    try {
        const result = yield call(api.hasRelations, { templateSeq });

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
 * 삭제
 * @param {string|number} param0.payload.templateSeq 템플릿ID (필수)
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
export function* deleteTemplateSaga({ payload: { templateSeq, success, fail, error } }) {
    const ACTION = templateStore.DELETE_TEMPLATE;
    const SUCCESS = templateStore.DELETE_TEMPLATE_SUCCESS;
    message.key = 'failToDeleteTemplate';
    message.message = '삭제하지 못했습니다';
    message.options = { variant: 'error', persist: true };

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.deleteTemplate, { templateSeq });
        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response
            });
            message.message = '삭제하였습니다';
            message.options = { variant: 'success', persist: false };

            // 목록 다시 검색
            yield put({ type: templateStore.GET_TEMPLATES });
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            // 템플릿 삭제 실패
            message.message = response.data.header.message;
            if (typeof fail === 'function') yield call(fail, response.data);
        }
    } catch (e) {
        // 템플릿 삭제 에러
        if (typeof error === 'function') yield call(error, e);
    }
    yield put(finishLoading(ACTION));
    yield put(enqueueSnackbar(message));
}

/**
 * 저장/수정
 * @param {array} param0.payload.actions 액션리스트
 * @param {func} param0.payload.success 콜백
 */
export function* saveTemplateSaga({ payload: { actions, success } }) {
    let ACTION = templateStore.SAVE_TEMPLATE;
    message.key = 'failToSaveTemplate';
    message.message = '저장하지 못했습니다';
    message.options = { variant: 'error', persist: true };

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

        // 템플릿 데이터와 템플릿 바디
        const templateData = yield select((state) => state.templateStore.detail);
        const templateBody = yield select((state) => state.templateStore.templateBody);
        let response;

        if (templateData.templateSeq) {
            response = yield call(api.putTemplate, { template: { ...templateData, templateBody } });
        } else {
            response = yield call(api.postTemplate, {
                template: { ...templateData, templateBody }
            });
        }

        if (response.data.header.success) {
            yield put({
                type: templateStore.GET_TEMPLATE_SUCCESS,
                payload: response.data
            });
            message.message = templateData.templateSeq ? '수정하였습니다' : '등록하였습니다';
            message.options = { variant: 'success', persist: false };

            // 목록 다시 검색
            yield put({ type: templateStore.GET_TEMPLATES });

            // 템플릿 히스토리 초기화
            yield put({ type: templateHistoryStore.CLEAR_HISTORIES });
            if (typeof success === 'function') yield call(success, response.data.body);
        } else {
            yield put({
                type: templateStore.GET_TEMPLATE_FAILURE,
                payload: response.data,
                error: true
            });
            message.message = response.data.header.message;
        }
    } catch (e) {
        yield put({
            type: templateStore.GET_TEMPLATE_FAILURE,
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
 * @param {string|number} param0.payload.templateSeq 템플릿ID
 * @param {string} param0.payload.templateName 템플릿명
 * @param {string} param0.payload.domainId 도메인ID
 * @param {func} param0.payload.success 성공 콜백
 * @param {func} param0.payload.fail 실패 콜백
 * @param {func} param0.payload.error 에러 콜백
 */
export function* copyTemplateSaga({
    payload: { templateSeq, templateName, domainId, success, fail, error }
}) {
    const ACTION = templateStore.COPY_TEMPLATE;
    message.key = `templateCopy${new Date().getTime() + Math.random()}`;
    message.message = '복사하지 못했습니다';
    message.options = { variant: 'error', persist: true };

    yield put(startLoading(ACTION));
    try {
        const result = yield call(api.copyTemplate, { templateSeq, templateName, domainId });

        if (result.data.header.success) {
            message.message = '복사하였습니다';
            message.options = { variant: 'success', persist: false };

            // 검색조건 변경
            yield put({
                type: templateStore.CHANGE_SEARCH_OPTION,
                payload: { key: 'domainId', value: domainId || 'all' }
            });

            // 목록 다시 검색
            yield put({ type: templateStore.GET_TEMPLATES });
            if (typeof success === 'function') yield call(success, result.data.header.body);
        } else {
            message.message = result.data.header.message;
            if (typeof fail === 'function') yield call(fail, result.data.header.body);
        }
    } catch (e) {
        if (typeof error === 'function') yield call(error, e);
    }
    yield put(finishLoading(ACTION));
    yield put(enqueueSnackbar(message));
}

/**
 * 템플릿 데이터 초기화
 */
export function* clearTemplateSaga({ payload }) {
    if (!payload || payload.search) {
        yield put({
            type: templateStore.CLEAR_SEARCH_OPTION
        });
    }
    if (!payload || payload.list) {
        yield put({
            type: templateStore.CLEAR_TEMPLATE_LIST
        });
    }
    if (!payload || payload.detail) {
        yield put({
            type: templateStore.CLEAR_TEMPLATE_DETAIL
        });
    }
    // 템플릿 히스토리 초기화
    if (!payload || payload.history) {
        yield put({
            type: templateHistoryStore.CLEAR_HISTORIES
        });
    }
    // 템플릿 관련아이템 초기화
    if (!payload || payload.relation) {
        yield put({
            type: templateRelationPGStore.CLEAR_RELATIONS
        });
        yield put({
            type: templateRelationCSStore.CLEAR_RELATIONS
        });
        yield put({
            type: templateRelationCTStore.CLEAR_RELATIONS
        });
        yield put({
            type: templateRelationCPStore.CLEAR_RELATIONS
        });
    }
}

/**
 * saga
 */
export default function* templateSaga() {
    yield takeLatest(templateStore.GET_TEMPLATES, getTemplatesSaga);
    yield takeLatest(templateStore.GET_TEMPLATE, getTemplateSaga);
    yield takeLatest(templateStore.SAVE_TEMPLATE, saveTemplateSaga);
    yield takeLatest(templateStore.COPY_TEMPLATE, copyTemplateSaga);
    yield takeLatest(templateStore.HAS_RELATIONS, hasRelationSaga);
    yield takeLatest(templateStore.DELETE_TEMPLATE, deleteTemplateSaga);
    yield takeLatest(templateStore.CLEAR_TEMPLATE, clearTemplateSaga);
    // 히스토리
    yield takeLatest(templateHistoryStore.GET_HISTORIES, getHistoriesSaga);
    // 관련아이템
    yield takeLatest(templateRelationPGStore.GET_RELATIONS, getRelationsSaga);
    yield takeLatest(templateRelationCSStore.GET_RELATIONS, getRelationsSaga);
    yield takeLatest(templateRelationCTStore.GET_RELATIONS, getRelationsSaga);
    yield takeLatest(templateRelationCPStore.GET_RELATIONS, getRelationsSaga);
}
