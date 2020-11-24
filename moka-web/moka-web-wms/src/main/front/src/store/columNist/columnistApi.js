import qs from 'qs';
import instance from '../commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 바로가기 목록 조회
export const getColumnistList = (search) => {
    return instance.get(`/api/columnists?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 칼럼리스트 정보 조회.
export const getColumnist = ({ seqNo }) => {
    return instance.get(`/api/columnists/${seqNo}`).catch((err) => {
        throw err;
    });
};

// 모달창 기자 리스트 조회.
export const getRepoterList = (search) => {
    return instance.get(`/api/reporters?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 칼럼 리스트 신규 등록.
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

// 칼럼 리스트 정보 수정.
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
