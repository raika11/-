import qs from 'qs';
import instance from '@store/commons/axios';

// 수신기사 목록 조회
export const getRcvArticleList = ({ search }) => {
    return instance.get(`/api/rcv-articles?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 수신기사 조회
export const getRcvArticle = ({ rid }) => {
    return instance.get(`/api/rcv-articles/${rid}`).catch((err) => {
        throw err;
    });
};

// 수신기사 => 등록기사 부가정보 수정하면서 등록(application/json)
export const postRcvArticle = ({ rcvArticle }) => {
    return instance
        .post(`/api/rcv-articles/articles/${rcvArticle.rid}`, rcvArticle, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 수신기사 => 등록기사 등록만
export const postRcvArticleWithRid = ({ rid }) => {
    return instance.post(`/api/rcv-articles/articles/${rid}/with-rid`).catch((err) => {
        throw err;
    });
};
