import axios from './axios';

/** 요청 인터셉터 */
const onRequest = (config) => {
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
    return Promise.reject(error);
};

export default {
    setupInterceptors: () => {
        // request 인터셉터
        axios.interceptors.request.use(onRequest, onFail);

        // response 인터셉터
        axios.interceptors.response.use(onSuccess, onFail);
    }
};
