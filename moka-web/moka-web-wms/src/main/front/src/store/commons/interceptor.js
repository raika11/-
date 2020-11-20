import axios from './axios';
import { setLocalItem, getLocalItem } from '@utils/storageUtil';
import toast from '@utils/toastUtil';
import { AUTHORIZATION } from '@/constants';
//import { auth } from '@store/auth/index';
import { logout } from '@store/auth/authAction';

export default {
    setupInterceptors: (store) => {
        const goToLogin = (message) => {
            setLocalItem({ key: AUTHORIZATION, value: undefined });
            // store.dispatch(
            //     enqueueToast({
            //         key: 'loginAuthorization',
            //         message,
            //         callback: () => {
            //             window.location.reload();
            //         },
            //         options: {
            //             persist: true,
            //         },
            //     }),
            // );
        };

        /** 요청 인터셉터 */
        const onRequest = (config) => {
            if (config.url !== '/loginJwt') {
                const token = getLocalItem(AUTHORIZATION);
                const menuId = store.getState().auth.latestMenuId;
                if (token) {
                    config.headers['x-menuid'] = menuId;
                    config.headers[AUTHORIZATION] = token;
                    return config;
                }
                goToLogin('로그인 정보가 없습니다.\n로그인 페이지로 이동합니다.');
                return null;
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
            if (typeof error.response === 'undefined') {
                toast.error('네트워크가 불안정 합니다. 다시 시도해 주세요.');
            } else {
                const header = error.response.data.header;
                toast.error(header.message);
                const errorCode = error.response.status;
                switch (errorCode) {
                    case 401:
                        store.dispatch(logout());
                        break;
                    default:
                        window.location = `/${errorCode}`;
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
