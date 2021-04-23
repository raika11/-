import axios from './axios';
import { AUTHORIZATION } from '@/constants';
import util from '@utils/commonUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { logout } from '@store/auth';

let queue = [];

/**
 * axios interceptor
 */
export default {
    setupInterceptors: (store) => {
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
        const onSuccess = (response) => response;

        /** 응답 실패 */
        const onFail = (error) => {
            if (typeof error.response !== 'undefined') {
                const header = error.response.data.header;
                const errorCode = error.response.status;

                if (queue.findIndex((q) => String(q) === String(errorCode)) < 0) {
                    queue.push(errorCode);
                    console.log('queue push', queue);
                    toast.error(header.message);

                    util.delay(500).then(() => {
                        switch (errorCode) {
                            case 401:
                                store.dispatch(logout());
                                break;
                            default:
                                if (window.lcation !== `/${errorCode}`) window.location = `/${errorCode}`;
                                break;
                        }
                        queue = queue.filter((q) => q !== errorCode);
                    });
                } else {
                    console.log('in queue', queue);
                }
            }
            return Promise.reject(error);
        };

        // request interceptor
        axios.interceptors.request.use(onRequest, (error) => Promise.reject(error));

        // response interceptor
        axios.interceptors.response.use(onSuccess, onFail);
    },
};
