// import instance from '../commons/axios';
import qs from 'qs';
import instance from '@store/commons/axios';
// import { objectToFormData } from '@utils/convertUtil';

// 기자관리 목록 조회
export const getReporterList = ({ search }) => {
    return instance.get(`/api/reporters?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Podty 에피소트 목록 조회
export const getPodtyChannels = () => {
    return instance.get(`/api/podty/channels`).catch((err) => {
        throw err;
    });
};

// 채널 목록 조회
export const getJpods = ({ search }) => {
    return instance.get(`/api/jpods?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 채널 정보 조회
export const getJpodsInfo = ({ chnlSeq }) => {
    return instance.get(`/api/jpods/${chnlSeq}`).catch((err) => {
        throw err;
    });
};

// 채널 저장.
export const saveJpodChannel = ({ channelinfo }) => {
    return instance
        .post(`/api/jpods`, channelinfo, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 채널 수정.
export const updateJpodChannel = ({ chnlSeq, channelinfo }) => {
    return instance
        .put(`/api/jpods/${chnlSeq}`, channelinfo, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 채널 삭제.
export const deleteJpodChannel = ({ chnlSeq }) => {
    return instance.delete(`/api/jpods/${chnlSeq}`).catch((err) => {
        throw err;
    });
};

// 에피소드 목록 조회
export const getEpisodes = ({ search }) => {
    return instance.get(`/api/jpod/episodes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 에피소드 정보 조회.
export const getEpisodesInfo = ({ chnlSeq, epsdSeq }) => {
    return instance.get(`/api/jpod/${chnlSeq}/episodes/${epsdSeq}`).catch((err) => {
        throw err;
    });
};

// 에피소드 채널 조회.
export const getEpisodeChannels = ({ search }) => {
    return instance.get(`/api/jpods?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Podty 에피소드 목록 조회 ( 모달 )
export const getPodtyEpisodesList = ({ castSrl }) => {
    return instance.get(`/api/podty/channels/${castSrl}/episodes`).catch((err) => {
        throw err;
    });
};

// 에피소드 등록 처리.
export const saveJpodEpisode = ({ chnlSeq, episodeinfo }) => {
    return instance
        .post(`/api/jpod/${chnlSeq}/episodes`, episodeinfo, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 에피소드 업데이트 처리.
export const updateJpodEpisode = ({ chnlSeq, epsdSeq, episodeinfo }) => {
    return instance
        .put(`/api/jpod/${chnlSeq}/episodes/${epsdSeq}`, episodeinfo, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 브라이트 코브 몰록 조회.
export const getBrightOvp = ({ search }) => {
    return instance.get(`/api/ovp?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 브라이트 코브 저장.
export const saveBrightOvp = ({ ovpdata }) => {
    return instance
        .post(`/api/ovp`, ovpdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

export const getNoticesList = ({ search }) => {
    return instance.get(`/api/boards/jpod-notices?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 게시판 게시글 정보.
export const getBoardContentsInfo = ({ boardId, boardSeq }) => {
    return instance.get(`/api/boards/${boardId}/contents/${boardSeq}`).catch((err) => {
        throw err;
    });
};

// 보드 채널 목록 가지고 오기 ( JPOD )
export const getBoardJpodChannalList = () => {
    return instance.get(`/api/jpods?usedYn=Y`).catch((err) => {
        throw err;
    });
};

export const getBoardInfo = ({ search }) => {
    return instance.get(`/api/board-info?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
