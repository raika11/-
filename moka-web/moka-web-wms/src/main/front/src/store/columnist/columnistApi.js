import qs from 'qs';
import instance from '../commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 칼럼니스트 목록 조회
export const getColumnistList = ({ search }) => {
    return instance.get(`/api/columnists?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 칼럼니스트 정보 조회
export const getColumnist = ({ seqNo }) => {
    return instance.get(`/api/columnists/${seqNo}`).catch((err) => {
        throw err;
    });
};

// 칼럼니스트 신규 등록
export const postColumnist = ({ columnist }) => {
    return instance
        .post(`/api/columnists`, objectToFormData(columnist), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 칼럼니스트 정보 수정
export const putColumnist = ({ columnist }) => {
    return instance
        .put(`/api/columnists/${columnist.seqNo}`, objectToFormData(columnist), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
