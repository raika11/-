import qs from 'qs';
import instance from '@store/commons/axios';

// 페이지트리 조회
export const getPageTree = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/pages/tree?${queryString}`).catch((err) => {
        throw err;
    });
};

// 페이지목록 조회
export const getPageList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/pages?${queryString}`).catch((err) => {
        throw err;
    });
};

// 페이지 조회
export const getPage = ({ pageSeq }) => {
    return instance.get(`/api/pages/${pageSeq}`).catch((err) => {
        throw err;
    });
};

// 페이지 저장(application/json)
export const postPage = ({ page }) => {
    return instance
        .post('/api/pages', page, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 페이지 수정(application/json)
export const putPage = ({ page }) => {
    return instance
        .put(`/api/pages/${page.pageSeq}`, page, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 관련 아이템 확인
// export const hasRelationList = ({ pageSeq }) => {
//     return instance.get(`/api/pages/${pageSeq}/has-relations`).catch((err) => {
//         throw err;
//     });
// };

// 관련 아이템 조회
// export const getRelationList = ({ search }) => {
//     const queryString = qs.stringify(search);
//     return instance.get(`/api/pages/${search.pageSeq}/relations?${queryString}`).catch((err) => {
//         throw err;
//     });
// };

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
export const deletePage = ({ pageSeq }) => {
    return instance.delete(`/api/pages/${pageSeq}`).catch((err) => {
        throw err;
    });
};
