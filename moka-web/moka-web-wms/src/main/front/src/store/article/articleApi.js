import qs from 'qs';
import instance from '@store/commons/axios';

// 기사 목록 조회
export const getArticleList = ({ search }) => {
    // searchType : all, title, reporterId, reporterName
    const queryString = qs.stringify(search);
    return instance.get(`/api/articles?${queryString}`).catch((err) => {
        throw err;
    });
};

// 기사 편집제목 수정
export const putArticleEditTitle = ({ totalId, title, mobTitle }) => {
    return instance.get(`/api/articles/${totalId}/edit-title?${qs.stringify({ title, mobTitle })}`).catch((err) => {
        throw err;
    });
};
