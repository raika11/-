import axios from './axios';
import { AUTHORIZATION } from '@/constants';
import util from '@utils/commonUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { logout } from '@store/auth';

/**
 * axios를 사용하여 api 호출 전 interceptor
 */
export default {
    setupInterceptors: (store) => {
        // const goToLogin = (message) => {
        //     setLocalItem({ key: AUTHORIZATION, value: undefined });
        //     store.dispatch(
        //         enqueueToast({
        //             key: 'loginAuthorization',
        //             message,
        //             callback: () => {
        //                 window.location.reload();
        //             },
        //             options: {
        //                 persist: true,
        //             },
        //         }),
        //     );
        // };

        /** 요청 인터셉터 */
        const onRequest = (config) => {
            if (config.url !== '/loginJwt' && config.url.indexOf('/member-join') < 0) {
                const token = util.getLocalItem(AUTHORIZATION);
                if (!token) {
                    // 인증 토큰 없음
                    messageBox.alert('로그인 정보가 없습니다.\n로그인 페이지로 이동합니다.', () => {
                        window.location.reload();
                    });
                    return null;
                } else {
                    const menuId = store.getState().auth.latestMenuId;
                    config.headers['x-menuid'] = menuId;
                    config.headers[AUTHORIZATION] = token;
                    return config;
                }
            }
            return config;
        };

        /** 응답 성공 */
        const onSuccess = (response) => {
            // const { config, data } = response;
            // const { header: resultHeader } = data;

            return response;
        };

        /** 응답 실패 */
        const onFail = (error) => {
            const queue = [];

            if (typeof error.response !== 'undefined') {
                // const header = error.response.data.header;
                // toast.error(header.message);
                const errorCode = error.response.status;

                switch (errorCode) {
                    case 401:
                        store.dispatch(logout());
                        break;
                    default:
                        if (window.location !== `/${errorCode}`) window.location = `/${errorCode}`;
                        break;
                }
            }

            return Promise.reject(error);
        };

        // request 인터셉터
        axios.interceptors.request.use(onRequest, onFail);

        // response 인터셉터
        axios.interceptors.response.use(onSuccess, onFail);
    },
};
