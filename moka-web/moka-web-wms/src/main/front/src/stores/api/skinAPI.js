import qs from 'qs';
import client from './client';

// 스킨목록 조회
export const getSkins = ({ search }) => {
    const queryString = qs.stringify(search);
    return client.get(`/api/skins?${queryString}`).catch((err) => {
        throw err;
    });
};
