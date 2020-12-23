import qs from 'qs';
import instance from '@store/commons/axios';

// 수신기사 목록 조회
export const getRcvArticleList = ({ search }) => {
    return instance.get(`/api/rcv-articles?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
