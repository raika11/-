import qs from 'qs';
import instance from '@store/commons/axios';

// 등록 기사 목록 조회
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

// 등록 기사 단건 조회
export const getArticle = ({ totalId }) => {
    return instance.get(`/api/articles/${totalId}`).catch((err) => {
        throw err;
    });
};

// 등록 기사 수정 (application/json)
export const putArticle = ({ article }) => {
    return instance
        .put(`/api/articles/${article.totalId}`, article, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 등록 기사 삭제 (delete 아니고 post임)
export const deleteArticle = ({ totalId }) => {
    return instance.post(`/api/articles/${totalId}/delete`).catch((err) => {
        throw err;
    });
};

// 등록 기사 중지
export const stopArticle = ({ totalId }) => {
    return instance.post(`/api/articles/${totalId}/stop`).catch((err) => {
        throw err;
    });
};

// 등록 기사 cdn 등록 (get임)
export const registCdn = ({ totalId }) => {
    return instance.get(`/api/articles/${totalId}/cdn`).catch((err) => {
        throw err;
    });
};

// 등록 기사 편집 히스토리 조회
export const getArticleHistoryList = ({ search }) => {
    return instance.get(`/api/articles/${search.totalId}/histories`).catch((err) => {
        throw err;
    });
};
