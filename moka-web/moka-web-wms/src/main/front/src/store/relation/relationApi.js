import qs from 'qs';
import instance from '@store/commons/axios';

// 페이지트리 조회
export const getRelationList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/relations?${queryString}`).catch((err) => {
        throw err;
    });
};
