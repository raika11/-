import qs from 'qs';
import instance from '../commons/axios';

// 편집로그 목록 조회
export const getEditLogList = ({ search }) => {
    return instance.get(`/api/edit-logs?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 편집로그 단건 조회
export const getEditLog = ({ seqNo }) => {
    return instance.get(`/api/edit-logs/${seqNo}`).catch((err) => {
        throw err;
    });
};
