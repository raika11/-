import qs from 'qs';
import client from './client';

// 볼륨 목록 조회
export const getVolumes = ({ search }) => {
    return client.get(`/api/volumes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 볼륨 정보 조회
export const getVolume = (volumeId) => {
    return client.get(`/api/volumes/${volumeId}`).catch((err) => {
        throw err;
    });
};

// 볼륨 저장
export const postVolume = ({ volume }) => {
    return client.post('/api/volumes', qs.stringify(volume)).catch((err) => {
        throw err;
    });
};

// 볼륨 수정
export const putVolume = ({ volume }) => {
    return client.put(`/api/volumes/${volume.volumeId}`, qs.stringify(volume)).catch((err) => {
        throw err;
    });
};

// 볼륨 삭제
export const deleteVolume = ({ volumeId }) => {
    return client.delete(`/api/volumes/${volumeId}`).catch((err) => {
        throw err;
    });
};

// 관련아이템 확인
export const hasRelations = ({ volumeId }) => {
    return client.get(`/api/volumes/${volumeId}/hasRelations`).catch((err) => {
        throw err;
    });
};
