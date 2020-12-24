import qs from 'qs';
import instance from '@store/commons/axios';

// 데스킹 매체 목록 조회
export const getDeskingSourceList = () => {
    return instance.get(`/api/article-sources/desking`).catch((err) => {
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

// 매체 목록 조회
export const getSourceList = ({ search }) => {
    return instance.get(`/api/article-sources?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 벌크전송 매체 목록 조회(네이버채널용)
export const getBulkSourceList = () => {
    return instance.get(`/api/article-sources/types/BULK`).catch((err) => {
        throw err;
    });
};

// 매체 상세조회
export const getArticleSource = ({ sourceCode }) => {
    return instance.get(`/api/article-sources/${sourceCode}`).catch((err) => {
        throw err;
    });
};

// 매체 수정
export const putArticleSource = ({ source }) => {
    return instance.put(`/api/article-sources/${source.sourceCode}`, qs.stringify(source)).catch((err) => {
        throw err;
    });
};

// 매체 등록
export const postArticleSource = ({ source }) => {
    return instance.post(`/api/article-sources`, qs.stringify(source)).catch((err) => {
        throw err;
    });
};
