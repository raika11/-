import qs from 'qs';
import instance from '../commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 바로가기 목록 조회
export const getDirectLinkList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`api링크?${queryString}`).catch((err) => {
        throw err;
    });
};

// 바로가기 등록(폼데이터)
export const postDirectLink = ({ directLink }) => {
    return instance
        .post('api링크', objectToFormData(directLink), {
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
        .put('api링크', objectToFormData(directLink), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
