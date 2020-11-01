import qs from 'qs';
import instance from '@store/commons/axios';

// 페이지 문법체크
export const postSyntax = ({ content }) => {
    const queryString = qs.stringify({ content });
    return instance.post('/api/merge/syntax', queryString).catch((err) => {
        throw err;
    });
};

// 미리보기
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

// 컴포넌트 미리보기
export const getPreviewCP = ({ pageSeq, componentWorkSeq, resourceYn }) => {
    return instance.get(`/api/merge/previewCP?pageSeq=${pageSeq}&componentWorkSeq=${componentWorkSeq}&resourceYn=${resourceYn || 'Y'}`).catch((err) => {
        throw err;
    });
};
