import qs from 'qs';
import instance from '../commons/axios';

/**
 * 댓글 화면 초기 설정 정보 조회
 * 매체 정보: COMMENT_MEDIA_CODE
 * 댓글 상태: COMMENT_STATUS_CODE
 * 댓글 정렬 순서: COMMENT_ORDER_CODE
 * 계정 정보: COMMENT_SITE_CODE
 *
 *
 */
export const getInitData = () => {
    return instance.get(`/api/comments/init`).catch((err) => {
        throw err;
    });
};

/**
 * 댓글 목록 조회
 */
export const getCommentList = ({ search }) => {
    return instance.get(`/api/comments?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

/**
 * 댓글 상태 변경
 */
export const deleteComment = ({ cmtSeq, params }) => {
    return instance.delete(`/api/comments/${cmtSeq}/status?${qs.stringify(params)}`).catch((err) => {
        throw err;
    });
};

/**
 * 차단 목록 조회
 */
export const getCommentsBlocks = ({ search }) => {
    return instance.get(`/api/comments-blocks?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 차단 저장
export const postBlock = ({ comment }) => {
    return instance.post('/api/comments', qs.stringify(comment)).catch((err) => {
        throw err;
    });
};

/**
 * 차단 등록
 */
export const postCommentsBlocks = ({ blockFormData }) => {
    return instance.post('/api/comments-blocks', blockFormData).catch((err) => {
        throw err;
    });
};

/**
 * 차단 등록 수정
 */
export const putCommentsBlocks = ({ seqNo, blockFormData }) => {
    return instance.put(`/api/comments-blocks/${seqNo}`, blockFormData).catch((err) => {
        throw err;
    });
};

/**
 * 차단 리스트 차단/복원
 */
export const putCommentsBlocksUsed = ({ seqNo, usedYn }) => {
    return instance.put(`/api/comments-blocks/${seqNo}/used?usedYn=${usedYn}`).catch((err) => {
        throw err;
    });
};

/**
 * 차단 히스토리
 */
export const getBlockHistory = ({ seqNo }) => {
    return instance.get(`/api/comments-blocks/${seqNo}/historys`).catch((err) => {
        throw err;
    });
};
