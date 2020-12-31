import qs from 'qs';
import instance from '@store/commons/axios';

// 기사 목록 조회
export const getArticleList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/articles?${queryString}`).catch((err) => {
        throw err;
    });
};

// 서비스 기사 목록 조회(페이지편집용)
export const getServiceArticleList = ({ search }) => {
    // searchType : all, title, reporterId, reporterName
    const queryString = qs.stringify(search);
    return instance.get(`/api/articles/service?${queryString}`).catch((err) => {
        throw err;
    });
};

// 기사 편집제목 수정
export const putArticleEditTitle = ({ totalId, title, mobTitle }) => {
    return instance.put(`/api/articles/${totalId}/edit-title?${qs.stringify({ title, mobTitle })}`).catch((err) => {
        throw err;
    });
};

// 벌크기사 목록 조회(네이버채널용)
export const getBulkArticleList = ({ search }) => {
    // searchType : all, title, reporterId, reporterName
    const queryString = qs.stringify(search);
    return instance.get(`/api/articles/bulk?${queryString}`).catch((err) => {
        throw err;
    });
};

// 기사 내 이미지 목록 조회
export const getArticleImageList = ({ totalId }) => {
    return instance.get(`/api/articles/${totalId}/components/image`).catch((err) => {
        throw err;
    });
};
