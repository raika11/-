import qs from 'qs';
import instance from '../commons/axios';

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
export const deleteComment = ({ cmtSeq }) => {
    return instance.delete(`/api/comments/${cmtSeq}`).catch((err) => {
        throw err;
    });
};

// 차단 목록 조회.
export const getCommentsBlocks = ({ search }) => {
    // console.log(search);
    return instance.get(`/api/comments-blocks?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 차단 등록.
export const postCommentsBlocks = ({ blockFormData }) => {
    return instance.post('/api/comments-blocks', blockFormData).catch((err) => {
        throw err;
    });
};

// 차단 등록 수정.
export const putCommentsBlocks = ({ seqNo, blockFormData }) => {
    return instance.put(`/api/comments-blocks/${seqNo}`, blockFormData).catch((err) => {
        throw err;
    });
};

// 차단 리스트 차단/복원
export const putCommentsBlocksUsed = ({ seqNo, useFormData }) => {
    return instance.put(`/api/comments-blocks/${seqNo}/used`, useFormData).catch((err) => {
        throw err;
    });
};
