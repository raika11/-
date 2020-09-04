import qs from 'qs';
import client from './client';

// 페이지트리 조회
export const getPageTree = ({ search }) => {
    return client.get(`/api/pages/tree?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 페이지정보 조회
export const getPage = (pageSeq) => {
    return client.get(`/api/pages/${pageSeq}`).catch((err) => {
        throw err;
    });
};

// 페이지 저장 : Payload Request
export const postPage = ({ page }) => {
    return client
        .post('/api/pages', page, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// 페이지 수정 : Payload Request
export const putPage = ({ page }) => {
    return client
        .put(`/api/pages/${page.pageSeq}`, page, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// 페이지 삭제
export const deletePage = (pageSeq) => {
    return client.delete(`/api/pages/${pageSeq}`).catch((err) => {
        throw err;
    });
};

// 페이지 관련아이템 조회.
// export const getChildRelationList = ({ search }) => {
//     return client
//         .get(`/api/pages/${search.pageSeq}/childRelations?${qs.stringify(search)}`)
//         .catch((err) => {
//             throw err;
//         });
// };

// 페이지 purge
export const getPurge = (pageSeq) => {
    return client.get(`/api/pages/${pageSeq}/purge`).catch((err) => {
        throw err;
    });
};

// 페이지 히스토리 목록 조회
export const getHistoryList = ({ search }) => {
    return client.get(`/api/pages/${search.seq}/histories?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 페이지목록 조회
export const getPageList = ({ search }) => {
    return client.get(`/api/pages?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
