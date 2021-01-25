import qs from 'qs';
import instance from '@store/commons/axios';

// cdn 기사 목록 조회
export const getCdnArticleList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/cdn-articles?${queryString}`).catch((err) => {
        throw err;
    });
};

// cdn 기사 등록 (application/json)
export const postCdnArticle = ({ cdnArticle }) => {
    return instance
        .post('/api/cdn-articles', cdnArticle, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// cdn 기사 단건 조회
export const getCdnArticle = ({ totalId }) => {
    return instance.get(`/api/cdn-articles/${totalId}`).catch((err) => {
        throw err;
    });
};

// cdn 기사 수정 (application/json)
export const putCdnArticle = ({ cdnArticle }) => {
    return instance
        .put(`/api/cdn-articles/${cdnArticle.totalId}`, cdnArticle, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// cdn 기사 캐시 삭제
export const clearCache = ({ totalId }) => {
    return instance.put(`/api/cdn-articles/${totalId}/clear-cache`).catch((err) => {
        throw err;
    });
};

// cdn 존재 여부 체크
export const checkExists = ({ totalId }) => {
    return instance.get(`/api/cdn-articles/${totalId}/exists`).catch((err) => {
        throw err;
    });
};
