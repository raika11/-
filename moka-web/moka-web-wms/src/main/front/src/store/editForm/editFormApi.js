import qs from 'qs';
import instance from '../commons/axios';

// Edit Form목록 조회
export const getEditFormList = ({ search }) => {
    return instance.get(`/api/edit-forms?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Edit Form정보 조회
export const getEditForm = (channelName) => {
    return instance.get(`/api/edit-forms/${channelName}`).catch((err) => {
        throw err;
    });
};

// Edit Form 저장
export const postEditForm = ({ channelId, partId, editForm }) => {
    return instance.post(`/api/edit-forms/${channelId}/parts/${partId}`, qs.stringify(editForm)).catch((err) => {
        throw err;
    });
};

// Edit Form 수정
export const putEditForm = ({ channelId, part }) => {
    return instance.put(`/api/edit-forms/${channelId}`, qs.stringify(part)).catch((err) => {
        throw err;
    });
};

// Edit Form 삭제
export const deleteEditForm = ({ channelId }) => {
    return instance.delete(`/api/edit-forms/${channelId}`).catch((err) => {
        throw err;
    });
};
