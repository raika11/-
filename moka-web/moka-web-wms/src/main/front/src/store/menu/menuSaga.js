import { takeLatest, put, call, select } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { callApiAfterActions, createRequestSaga, errorResponse } from '../commons/saga';
import * as menuAPI from './menuApi';
import * as menuAction from './menuAction';

/**
 * 목록
 */
const getMenuList = callApiAfterActions(menuAction.GET_MENU_LIST, menuAPI.getMenuList, (state) => state.menu);

/**
 * 데이터 조회
 */
const getMenu = createRequestSaga(menuAction.GET_MENU, menuAPI.getMenu);

/**
 * 메뉴ID 중복 체크
 * @param {string} param0.payload.menuId 메뉴ID
 * @param {func} param0.payload.callback 콜백
 */
function* duplicateCheckId({ payload: { menuId, callback } }) {
    const ACTION = menuAction.DUPLICATE_CHECK_ID;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(menuAPI.duplicateCheckId, menuId);
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 등록/수정
 * @param {string} param0.payload.type insert|update
 * @param {array} param0.payload.actions 선처리 액션들
 * @param {func} param0.payload.callback 콜백
 */
function* saveMenu({ payload: { type, actions, callback } }) {
    const ACTION = menuAction.SAVE_MENU;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        // 메뉴 데이터
        const menu = yield select((store) => store.menu.menu);
        const response = type === 'insert' ? yield call(menuAPI.postMenu, { menu }) : yield call(menuAPI.putMenu, { menu });

        callbackData = response.data;

        if (response.data.header.success) {
            yield put({
                type: menuAction.GET_MENU_SUCCESS,
                payload: response.data,
            });
            // 목록 다시 검색

            yield put({
                type: menuAction.GET_MENU_LIST,
            });
        } else {
            yield put({
                type: menuAction.GET_MENU_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = { header: { success: false }, body: e };

        yield put({
            type: menuAction.GET_MENU_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 메뉴를 사용하고있는 그룹 및 사용자 체크
 * @param {string} param0.payload.menuId 메뉴ID
 * @param {func} param0.payload.callback 콜백
 */
function* existAuth({ payload: { menuId, callback } }) {
    const ACTION = menuAction.EXIST_AUTH;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        const response = yield call(menuAPI.existAuth, menuId);
        callbackData = response.data;
    } catch (e) {
        callbackData = errorResponse(true);
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

/**
 * 삭제
 * @param {string} param0.payload.menuId 도메인아이디
 * @param {func} param0.payload.callback 콜백
 */
function* deleteMenu({ payload: { menuId, actions, callback } }) {
    const ACTION = menuAction.DELETE_MENU;
    let callbackData = {};

    yield put(startLoading(ACTION));

    try {
        // actions 먼저 처리
        if (actions && actions.length > 0) {
            for (let i = 0; i < actions.length; i++) {
                const act = actions[i];
                yield put({
                    type: act.type,
                    payload: act.payload,
                });
            }
        }

        const response = yield call(menuAPI.deleteMenu, { menuId });
        callbackData = response.data;

        if (response.data.header.success && response.data.body) {
            yield put({ type: menuAction.DELETE_MENU_SUCCESS });
        } else {
            yield put({
                type: menuAction.DELETE_MENU_FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        callbackData = { header: { success: false }, body: e };

        yield put({
            type: menuAction.DELETE_MENU_FAILURE,
            payload: callbackData,
        });
    }

    if (typeof callback === 'function') {
        yield call(callback, callbackData);
    }

    yield put(finishLoading(ACTION));
}

export default function* menuSaga() {
    yield takeLatest(menuAction.GET_MENU_LIST, getMenuList);
    yield takeLatest(menuAction.GET_MENU, getMenu);
    yield takeLatest(menuAction.DUPLICATE_CHECK_ID, duplicateCheckId);
    yield takeLatest(menuAction.SAVE_MENU, saveMenu);
    yield takeLatest(menuAction.DELETE_MENU, deleteMenu);
    yield takeLatest(menuAction.EXIST_AUTH, existAuth);
}
