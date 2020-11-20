import qs from 'qs';
import instance from '../commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 바로가기 목록 조회
export const getDirectLinkList = (search) => {
    return instance.get(`/api/direct-links?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 정보 조회.
export const getDirectLink = (seq) => {
    return instance.get(`/api/direct-links/${seq.linkSeq}`).catch((err) => {
        throw err;
    });
};

// 바로가기 등록(폼데이터)
export const postDirectLink = ({ directLink }) => {
    return instance
        .post(`/api/direct-links`, objectToFormData(directLink), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 바로가기 수정(폼데이터
export const putDirectLink = ({ directLink }) => {
    return instance
        .put(`/api/direct-links/${directLink.linkSeq}`, objectToFormData(directLink), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 바로 가기 삭제.
export const deleteDirectLink = ({ linkSeq }) => {
    return instance.delete(`/api/direct-links/${linkSeq}`).catch((err) => {
        throw err;
    });
};
