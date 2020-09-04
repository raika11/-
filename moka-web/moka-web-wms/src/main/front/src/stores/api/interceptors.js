import client from './client';
import { UNAUTHORIZED } from '~/constants';
import { setLocalItem, getLocalItem } from '~/utils/storageUtil';
import { store } from '~/configure';
import { enqueueSnackbar } from '~/stores/notification/snackbarStore';

const goToLogin = (message) => {
    setLocalItem({ key: 'Authorization', value: undefined });
    store.dispatch(
        enqueueSnackbar({
            key: 'loginAuthorization',
            message,
            callback: () => {
                window.location.reload();
            },
            options: {
                persist: true
            }
        })
    );
};

/** 요청 인터셉터 */
const onRequest = (config) => {
    if (config.url !== '/loginJwt') {
        const token = getLocalItem({ key: 'Authorization' });
        if (token) {
            config.headers['Authorization'] = token;
            return config;
        }
        goToLogin('로그인 정보가 없습니다.\n로그인 페이지로 이동합니다.');
        return null;
    }
    return config;
};

/** 응답 성공 */
const onSuccess = (response) => {
    const { config, data } = response;
    const { header: resultHeader } = data;

    if (config.url !== '/loginJwt' && !resultHeader.success) {
        if (resultHeader.resultCode === UNAUTHORIZED) {
            /** 인증오류 */
            console.error(resultHeader.message);
            goToLogin(resultHeader.message);
            return null;
        }
        return response;
    }
    return response;
};

/** 응답 실패 */
const onFail = (error) => {
    console.error(error);
    goToLogin('서버 통신에 실패하였습니다.');
    return Promise.reject(error);
};

/** 인터셉터 설정 */
export default {
    setupInterceptors: () => {
        // request 인터셉터
        client.interceptors.request.use(onRequest, onFail);

        // response 인터셉터
        client.interceptors.response.use(onSuccess, onFail);
    }
};
