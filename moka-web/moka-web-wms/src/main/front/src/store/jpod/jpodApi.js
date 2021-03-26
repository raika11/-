import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 채널 > 팟티 목록 조회
export const getPodtyChannels = () => {
    return instance.get(`/api/podty/channels`).catch((err) => {
        throw err;
    });
};

// 채널 목록 조회
export const getChnlList = ({ search }) => {
    return instance.get(`/api/jpods?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 채널 정보 조회
export const getChnl = ({ chnlSeq }) => {
    return instance.get(`/api/jpods/${chnlSeq}`).catch((err) => {
        throw err;
    });
};

// 채널 등록
export const postChnl = ({ chnl }) => {
    return instance
        .post(`/api/jpods`, objectToFormData(chnl), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 채널 수정
export const putChnl = ({ chnl }) => {
    return instance
        .put(`/api/jpods/${chnl.chnlSeq}`, objectToFormData(chnl), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 채널 삭제
export const deleteChnl = ({ chnlSeq }) => {
    return instance.delete(`/api/jpods/${chnlSeq}`).catch((err) => {
        throw err;
    });
};

// 에피소드 목록 조회
export const getEpsdList = ({ search }) => {
    return instance.get(`/api/jpod/episodes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 에피소드 정보 조회
export const getEpsd = ({ chnlSeq, epsdSeq }) => {
    return instance.get(`/api/jpod/${chnlSeq}/episodes/${epsdSeq}`).catch((err) => {
        throw err;
    });
};

// 에피소드 등록
export const postEpsd = ({ epsd }) => {
    return instance
        .post(`/api/jpod/${epsd.chnlSeq}/episodes`, objectToFormData(epsd), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 에피소드 수정
export const putEpsd = ({ epsd }) => {
    return instance
        .put(`/api/jpod/${epsd.chnlSeq}/episodes/${epsd.epsdSeq}`, objectToFormData(epsd), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 에피소드 > 팟티 목록 조회
export const getPodtyEpisodesList = ({ castSrl }) => {
    return instance.get(`/api/podty/channels/${castSrl}/episodes`).catch((err) => {
        throw err;
    });
};

// J팟 채널 게시판 조회
export const getJpodBoard = ({ search }) => {
    return instance.get(`/api/board-info?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// J팟 채널 목록 조회
export const getBoardJpodChannalList = () => {
    return instance.get(`/api/jpods?usedYn=Y`).catch((err) => {
        throw err;
    });
};

// J팟 공지 게시판 목록 조회
export const getJpodNoticeList = ({ search }) => {
    return instance.get(`/api/boards/${search.boardId}/contents?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// J팟 공지 게시판 상세 조회
export const getJpodNoticeContents = ({ boardId, boardSeq }) => {
    return instance.get(`/api/boards/${boardId}/contents/${boardSeq}`).catch((err) => {
        throw err;
    });
};
