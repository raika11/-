// import qs from 'qs';
import instance from '@store/commons/axios';

// 매체 목록 조회
export const getSourceList = () => {
    return instance.get(`/api/article-sources/desking`).catch((err) => {
        throw err;
    });
};

// 벌크전송 매체 목록 조회(네이버채널용)
export const getBulkSourceList = () => {
    return instance.get(`/api/article-sources/types/BULK`).catch((err) => {
        throw err;
    });
};

// 타입별 매체 목록 조회
export const getTypeSourceList = ({ type }) => {
    // type: JOONGANG/CONSALES/JSTORE/SOCIAL/BULK/RCV, 수신기사는 JOONGANG로 조회할 것
    return instance.get(`/api/article-sources/types/${type}`).catch((err) => {
        throw err;
    });
};
