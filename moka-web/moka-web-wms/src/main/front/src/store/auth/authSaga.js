import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { startLoading, finishLoading } from '@store/loading/loadingAction';
import { setLocalItem } from '@utils/storageUtil';
import * as api from './authApi';
import * as domainApi from '../domain/domainApi';
import * as authAction from './authAction';
import toast, { messageBox } from '@utils/toastUtil';
import { AUTHORIZATION, SIGNIN_MEMBER_ID } from '@/constants';

/**
 * 로그인
 * @param {object} param0.payload
 */
export function* loginJwtSaga({ payload: { userId, userPassword, callback } }) {
    try {
        const response = yield call(api.loginJwt, userId, userPassword);
        const { headers } = response;
        if (headers.authorization) {
            yield call(setLocalItem, { key: AUTHORIZATION, value: headers.authorization });
            yield call(setLocalItem, { key: SIGNIN_MEMBER_ID, value: userId });
        }
        callback(response);
    } catch (err) {}
}

/**
 * 로그아웃
 */
export function* logout() {
    try {
        const response = yield call(api.logout);
        const { data } = response;

        if (data.header.success) {
            yield call(setLocalItem, { key: AUTHORIZATION, value: undefined });
            yield call(window.location.reload());
        }
    } catch (err) {}
}

/**
 * 메뉴 조회
 */
export function* getUserMenuTree({ payload: { pathName } }) {
    const ACTION = authAction.GET_USER_MENU_TREE;
    const SUCCESS = authAction.GET_USER_MENU_TREE_SUCCESS;
    const FAILURE = authAction.GET_USER_MENU_TREE_FAILURE;
    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.getUserMenuTree);

        if (response.data.header.success) {
            const menuOpens = {};
            const menuPaths = {};
            menuPaths['/404'] = '';
            menuPaths['/403'] = '';
            getOpenMenuParentMenuId(response.data.body.children, pathName, menuOpens, menuPaths);
            response.data.body.menuPaths = menuPaths;
            response.data.body.menuOpens = menuOpens;

            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response,
            });
        } else {
            yield put({
                type: FAILURE,
                payload: response.data,
                error: true,
            });
        }
    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
            error: true,
        });
    }
    yield put(finishLoading(ACTION));
}

const getOpenMenuParentMenuId = (menu, pathName, menuOpens, menuPaths, isOpen) => {
    for (let i = 0; i < menu.length; i++) {
        const menuItem = menu[i];
        isOpen = false;
        if (menuItem.children !== null) {
            getOpenMenuParentMenuId(menuItem.children, pathName, menuOpens, menuPaths, isOpen);
            if (isOpen && menuItem.depth !== 1) {
                menuOpens[menuItem.parentMenuId] = true;
            }
        } else {
            let menuPath = '';
            if (menuItem.menuUrl === '/') {
                menuPath = menuItem.menuUrl;
            } else if (menuItem.menuUrl.length > 0) {
                menuPath = '/' + menuItem.menuUrl.split('/')[1];
            }

            if (pathName === menuPath) {
                menuOpens[menuItem.parentMenuId] = true;
                isOpen = true;
            }

            menuPaths[menuItem.menuUrl] = menuItem.menuId;
        }
    }
};
/**
 * 도메인 목록 검색 => latestDomainId 변경
 */
export function* getDomainList({ payload: domainId }) {
    const ACTION = authAction.GET_DOMAIN_LIST;
    const SUCCESS = authAction.GET_DOMAIN_LIST_SUCCESS;
    const FAILURE = authAction.GET_DOMAIN_LIST_FAILURE;

    yield put(startLoading(ACTION));

    try {
        const searchOption = yield select((store) => store.auth.domainSearch);
        const latestDomainId = yield select((store) => store.auth.latestDomainId);
        const response = yield call(domainApi.getDomainList, { search: searchOption });

        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
            });

            const { list } = response.data.body;

            // 도메인 리스트가 0건이면 null로 셋팅
            if (list.length < 1) {
                yield put({
                    type: authAction.CHANGE_LATEST_DOMAINID,
                    payload: null,
                });
            }
            // 도메인 리스트가 1건 이상이고 전달받은 domainId가 리스트에 있으면 그 domainId로 셋팅
            if (domainId && list.findIndex((l) => l.domainId === domainId) >= 0) {
                yield put({
                    type: authAction.CHANGE_LATEST_DOMAINID,
                    payload: domainId,
                });
            } else {
                // 그 외의 경우 latestDomainId, 없으면 도메인 리스트의 첫번째 데이터로 셋팅한다
                yield put({
                    type: authAction.CHANGE_LATEST_DOMAINID,
                    payload: latestDomainId || list[0].domainId,
                });
            }
        } else {
            yield put({
                type: FAILURE,
                payload: response.data,
            });
        }
    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
        });
    }

    yield put(finishLoading(ACTION));
}

/**
 * authSaga
 */
export default function* authSaga() {
    yield takeLatest(authAction.LOGIN_JWT, loginJwtSaga);
    yield takeLatest(authAction.LOGOUT, logout);
    yield takeLatest(authAction.GET_USER_MENU_TREE, getUserMenuTree);
    yield takeLatest(authAction.GET_DOMAIN_LIST, getDomainList);
}
