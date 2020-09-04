import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as api from '~/stores/api/authAPI';
import { startLoading, finishLoading } from '~/stores/loadingStore';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';
import * as authStore from './authStore';
import { setLocalItem } from '~/utils/storageUtil';

/**
 * 로그인
 * @param {object} param0.payload
 */
export function* loginJwtSaga({ payload }) {
    try {
        const response = yield call(api.loginJwt, payload);
        const { headers, data } = response;

        if (headers.authorization) {
            setLocalItem({ key: 'Authorization', value: headers.authorization });
            window.location.reload();
        } else {
            // 인증없음
            yield put(
                enqueueSnackbar({
                    key: `loginNoAuth${new Date()}`,
                    message: data.header.message
                })
            );
        }
    } catch (err) {
        yield put(
            enqueueSnackbar({
                key: `loginJwt${new Date().getTime() + Math.random()}`,
                message: '서버 에러',
                options: {
                    variant: 'error',
                    persist: true
                }
            })
        );
    }
}

/**
 * 로그아웃
 */
export function* logoutSaga() {
    let message = {};
    message.key = 'logout';
    message.options = { variant: 'error', persist: true };

    try {
        const response = yield call(api.logout);
        const { data } = response;

        if (data.header.success) {
            message.message = '로그아웃하였습니다';
            message.options = { variant: 'success' };
            message.callback = () => {
                window.location.href = '/';
            };
            yield put(enqueueSnackbar(message));
            setLocalItem({ key: 'Authorization', value: undefined });
        } else {
            message.message = data.header.message;
            yield put(enqueueSnackbar(message));
        }
    } catch (err) {
        message.message = '서버 에러';
        yield put(enqueueSnackbar(message));
    }
}

/**
 * 메뉴 조회
 */
export function* getMenuSaga() {
    const ACTION = authStore.GET_MENU;
    const SUCCESS = authStore.GET_MENU_SUCCESS;
    const FAILURE = authStore.GET_MENU_FAILURE;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.getMenus);

        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response
            });
        } else {
            yield put({
                type: FAILURE,
                payload: response.data,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));
}

/**
 * 미디어 목록 검색 => latestMediaId 변경
 */
export function* getMediasSaga() {
    const ACTION = authStore.GET_MEDIAS;
    const SUCCESS = authStore.GET_MEDIAS_SUCCESS;
    const FAILURE = authStore.GET_MEDIAS_FAILURE;

    yield put(startLoading(ACTION));
    try {
        const response = yield call(api.getMedias);

        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response
            });
            if (response.data.body.list.length > 0) {
                // latestMediaId 변경시킴
                yield put({
                    type: authStore.CHANGE_LATEST_MEDIAID,
                    payload: { mediaId: response.data.body.list[0].mediaId }
                });
            }
        } else {
            yield put({
                type: FAILURE,
                payload: response.data,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));
}

/**
 * latestMediaId 변경 => 도메인 목록 검색
 */
export function* changeLatestMediaIdSaga({ payload: { mediaId, domainId } }) {
    const currentMediaId = yield select((state) => state.authStore.latestMediaId);

    /**
     * 현재 latestMediaId와 같은지 비교하여 다를 경우 도메인을 조회한다
     * 같은 경우 latestDomainId를 domainId로 셋팅한다
     */
    if (mediaId && currentMediaId !== mediaId) {
        // latestMediaId 변경
        yield put({
            type: authStore.CHANGE_LATEST_MEDIAID_RESULT,
            payload: mediaId
        });
        // 검색조건 변경
        yield put({
            type: authStore.CHANGE_DOMAIN_SEARCH_OPTION,
            payload: {
                key: 'mediaId',
                value: mediaId
            }
        });
        // 목록 조회
        yield put({
            type: authStore.GET_DOMAINS,
            payload: domainId
        });
    } else if (mediaId && currentMediaId === mediaId) {
        // latestDomainId 변경
        yield put({
            type: authStore.CHANGE_LATEST_DOMAINID,
            payload: domainId
        });
    }
}

/**
 * 도메인 목록 검색 => latestDomainId 변경
 */
export function* getDomainsSaga({ payload: domainId }) {
    const ACTION = authStore.GET_DOMAINS;
    const SUCCESS = authStore.GET_DOMAINS_SUCCESS;
    const FAILURE = authStore.GET_DOMAINS_FAILURE;

    yield put(startLoading(ACTION));
    try {
        const option = yield select((state) => state.authStore.domainSearch);
        const response = yield call(api.getDomains, { search: option });

        if (response.data.header.success) {
            yield put({
                type: SUCCESS,
                payload: response.data,
                meta: response
            });

            const { list } = response.data.body;

            // 도메인 리스트가 0건이면 undefined로 셋팅
            if (list.length < 1) {
                yield put({
                    type: authStore.CHANGE_LATEST_DOMAINID,
                    payload: undefined
                });
            }
            // 도메인 리스트가 1건 이상이고 전달받은 domainId가 리스트에 있으면 그 domainId로 셋팅
            if (domainId && list.findIndex((l) => l.domainId === domainId) >= 0) {
                yield put({
                    type: authStore.CHANGE_LATEST_DOMAINID,
                    payload: domainId
                });
            } else {
                // 그 외의 경우 모두 첫번째 데이터로 셋팅한다
                yield put({
                    type: authStore.CHANGE_LATEST_DOMAINID,
                    payload: response.data.body.list[0].domainId
                });
            }
        } else {
            yield put({
                type: FAILURE,
                payload: response.data,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(ACTION));
}

/**
 * authSaga
 */
export default function* authSaga() {
    yield takeLatest(authStore.LOGIN_JWT, loginJwtSaga);
    yield takeLatest(authStore.LOGOUT, logoutSaga);
    yield takeLatest(authStore.GET_MENU, getMenuSaga);
    yield takeLatest(authStore.GET_MEDIAS, getMediasSaga);
    yield takeLatest(authStore.GET_DOMAINS, getDomainsSaga);
    yield takeLatest(authStore.CHANGE_LATEST_MEDIAID, changeLatestMediaIdSaga);
}
