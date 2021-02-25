import qs from 'qs';
import instance from '@store/commons/axios';

// TEMS 문법체크
export const checkSyntax = ({ content }) => {
    const queryString = qs.stringify({ content });
    return instance.post('/api/merge/syntax', queryString).catch((err) => {
        throw err;
    });
};

// 페이지 미리보기
export const postPreviewPG = ({ page }) => {
    return instance
        .post('/api/merge/previewPG', page, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 기사페이지 미리보기
export const postPreviewAP = ({ articlePage, totalId }) => {
    return instance
        .post(`/api/merge/previewAP/${totalId}`, articlePage, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 미리보기
export const getPreviewCP = ({ areaSeq, componentWorkSeq, resourceYn }) => {
    return instance.get(`/api/merge/previewCP?areaSeq=${areaSeq}&componentWorkSeq=${componentWorkSeq}&resourceYn=${resourceYn || 'Y'}`).catch((err) => {
        throw err;
    });
};

// 편집영역 미리보기
export const getPreviewArea = ({ areaSeq }) => {
    return instance.get(`/api/merge/previewArea?areaSeq=${areaSeq}`).catch((err) => {
        throw err;
    });
};
