import qs from 'qs';
import instance from '../commons/axios';

// 히스토리 목록 조회
export const getHistoryList = ({ search }) => {
    return instance.get(`/api/histories?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 히스토리 정보 조회
export const getHistory = ({ seq, search }) => {
    return instance.get(`/api/histories/${seq}?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
