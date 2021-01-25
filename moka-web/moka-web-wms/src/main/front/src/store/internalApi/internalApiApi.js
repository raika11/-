import qs from 'qs';
import instance from '@store/commons/axios';

// api 목록 조회
export const getInternalApiList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/internal-apis?${queryString}`).catch((err) => {
        throw err;
    });
};

// api 등록
export const postInternalApi = ({ internalApi }) => {
    return instance.post('/api/internal-apis', qs.stringify(internalApi)).catch((err) => {
        throw err;
    });
};

// api 단건 조회
export const getInternalApi = ({ seqNo }) => {
    return instance.get(`/api/internal-apis/${seqNo}`).catch((err) => {
        throw err;
    });
};

// api 수정
export const putInternalApi = ({ internalApi }) => {
    return instance.put(`/api/internal-apis/${internalApi.seqNo}`, qs.stringify(internalApi)).catch((err) => {
        throw err;
    });
};

// api 삭제
export const deleteInternalApi = ({ seqNo }) => {
    return instance.delete(`/api/internal-apis/${seqNo}`).catch((err) => {
        throw err;
    });
};
