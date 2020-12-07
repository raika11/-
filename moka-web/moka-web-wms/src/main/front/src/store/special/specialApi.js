import qs from 'qs';
import instance from '../commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 디지털스페셜 목록조회
export const getSpecialList = ({ search }) => {
    return instance.get(`/api/specials?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 디지털스페셜 상세조회
export const getSpecial = ({ seqNo }) => {
    return instance.get(`/api/specials/${seqNo}`).catch((err) => {
        throw err;
    });
};

// 디지털스페셜 등록
export const postSpecial = ({ special }) => {
    return instance
        .post(`/api/specials?`, objectToFormData(special), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 디지털스페셜 수정
export const putSpecial = ({ special }) => {
    return instance
        .put(`/api/specials/${special.seqNo}?`, objectToFormData(special), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 디지털스페셜 삭제
export const deleteSpecial = ({ seqNo }) => {
    return instance.delete(`/api/specials/${seqNo}`).catch((err) => {
        throw err;
    });
};
