import qs from 'qs';
import instance from '../commons/axios';

// 공통 구분값 조회.
export const getInitData = () => {
    return instance.get(`/api/comments/init`).catch((err) => {
        throw err;
    });
};

// 댓글목록 조회
export const getCommentList = ({ search }) => {
    let newSearch = {};
    Object.keys(search).forEach(function (key) {
        if (search[key] && search[key] !== '') {
            newSearch[key] = search[key];
        }
    });

    return instance.get(`/api/comments?${qs.stringify(newSearch)}`).catch((err) => {
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
export const deleteComment = ({ cmtSeq, params }) => {
    return instance.delete(`/api/comments/${cmtSeq}/status?${qs.stringify(params)}`).catch((err) => {
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
export const putCommentsBlocksUsed = ({ seqNo, usedYn }) => {
    return instance.put(`/api/comments-blocks/${seqNo}/used?usedYn=${usedYn}`).catch((err) => {
        throw err;
    });
};

// 차단 히스토리.
export const getBlockHistory = ({ seqNo }) => {
    return instance.get(`/api/comments-blocks/${seqNo}/historys`).catch((err) => {
        throw err;
    });
};
