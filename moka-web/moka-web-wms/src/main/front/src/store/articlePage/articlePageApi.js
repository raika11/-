import qs from 'qs';
import instance from '@store/commons/axios';

// 페이지목록 조회
export const getArticlePageList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/article-pages?${queryString}`).catch((err) => {
        throw err;
    });
};

// 페이지 조회
export const getArticlePage = ({ artPageSeq }) => {
    return instance.get(`/api/article-pages/${artPageSeq}`).catch((err) => {
        throw err;
    });
};

// 기사 타입별 마지막 기사 조회
export const getPreviewTotalId = (artType) => {
    const queryString = qs.stringify(artType);
    return instance.get(`/api/article-pages/preview-totalid?${queryString}`).catch((err) => {
        throw err;
    });
};

// 동일 기사 유형 존재 여부
export const existsArtType = ({ domainId, artType, artPageSeq }) => {
    const queryString = qs.stringify({ domainId, artType, artPageSeq });
    return instance.get(`/api/article-pages/exists-type?${queryString}`).catch((err) => {
        throw err;
    });
};

// 페이지 저장(application/json)
export const postArticlePage = ({ articlePage }) => {
    return instance
        .post('/api/article-pages', articlePage, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 페이지 수정(application/json)
export const putArticlePage = ({ articlePage }) => {
    return instance
        .put(`/api/article-pages/${articlePage.artPageSeq}`, articlePage, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 관련 아이템 확인
export const hasRelationList = ({ artPageSeq }) => {
    return instance.get(`/api/article-pages/${artPageSeq}/has-relations`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 조회
export const getRelationList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/pages/${search.pageSeq}/relations?${queryString}`).catch((err) => {
        throw err;
    });
};

// 페이지 히스토리 목록 조회
export const getHistoryList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/pages/${search.pageSeq}/histories?${queryString}`).catch((err) => {
        throw err;
    });
};

// 페이지 히스토리 조회
export const getHistory = ({ pageSeq, histSeq }) => {
    return instance.get(`/api/pages/${pageSeq}/histories/${histSeq}`).catch((err) => {
        throw err;
    });
};

// 페이지 삭제
export const deleteArticlePage = ({ artPageSeq }) => {
    return instance.delete(`/api/article-pages/${artPageSeq}`).catch((err) => {
        throw err;
    });
};
