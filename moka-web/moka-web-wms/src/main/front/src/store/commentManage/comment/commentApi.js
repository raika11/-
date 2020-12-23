import qs from 'qs';
import instance from '../../commons/axios';

// 댓글목록 조회
export const getCommentList = ({ search }) => {
    return instance.get(`/api/comments?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 차단 저장
export const postBlock = ({ comment }) => {
    return instance.post('/api/comments', qs.stringify(comment)).catch((err) => {
        throw err;
    });
};

// 댓글 삭제
export const deleteComment = ({ commentSeq }) => {
    return instance.delete(`/api/comments/${commentSeq}`).catch((err) => {
        throw err;
    });
};
