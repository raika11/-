import qs from 'qs';
import instance from '@store/commons/axios';

// 포토 아카이브 사진 목록 조회
export const getPhotoList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/achive/photos?${queryString}`).catch((err) => {
        throw err;
    });
};

// 포토 아카이브 출처 목록 조회
export const getPhotoOrigins = ({ menuNo }) => {
    return instance.get(`/api/achive/photos/orgins?${qs.stringify({ menuNo })}`).catch((err) => {
        throw err;
    });
};

// 포토 아카이브 사진 유형 목록 조회
export const getPhotoTypes = () => {
    return instance.get(`/api/achive/photos/types`).catch((err) => {
        throw err;
    });
};

// 포토 아카이브 사진 정보 조회
export const getPhoto = ({ photoId }) => {
    return instance.get(`/api/achive/photos/${photoId}`).catch((err) => {
        throw err;
    });
};
