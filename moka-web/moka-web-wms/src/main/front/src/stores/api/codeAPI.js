import qs from 'qs';
import client from './client';

// search CodeId 리스트 조회
export const getSearchCodes = ({ search }) => {
    return client.get(`/api/codes/searchCodes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 대분류 리스트 조회
export const getLargeCodes = () => {
    return client.get('/api/codes/largeCodes').catch((err) => {
        throw err;
    });
};

// 중분류 리스트 조회
export const getMiddleCodes = ({ search }) => {
    return client.get(`/api/codes/middleCodes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 소분류 리스트 조회
export const getSmallCodes = ({ search }) => {
    return client.get(`/api/codes/smallCodes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
