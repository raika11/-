import qs from 'qs';
import instance from '@store/commons/axios';

// 관련아이템 목록 조회
export const getRelationList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/relations?${queryString}`).catch((err) => {
        throw err;
    });
};
