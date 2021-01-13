// import instance from '../commons/axios';
import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

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

// Podty 에피소트 목록 조회
export const getJpods = ({ search }) => {
    return instance.get(`/api/jpods?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Podty 에피소트 목록 조회
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
