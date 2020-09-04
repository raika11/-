import qs from 'qs';
import client from './client';

// 페이지 문법체크
export const postSyntax = (content) => {
    return client.post('/api/merge/syntax', qs.stringify({ content })).catch((err) => {
        throw err;
    });
};

export const postPreviewPG = (page) => {
    return client
        .post('/api/merge/previewPG', page, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

export const getPreviewCP = ({ pageSeq, componentWorkSeq, resourceYn }) => {
    return client
        .get(
            `/api/merge/previewCP?pageSeq=${pageSeq}&componentWorkSeq=${componentWorkSeq}&resourceYn=${
                resourceYn || 'Y'
            }`
        )
        .catch((err) => {
            throw err;
        });
};
