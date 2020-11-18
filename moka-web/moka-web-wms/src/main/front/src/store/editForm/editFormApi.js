import qs from 'qs';
import instance from '../commons/axios';

// Edit Form목록 조회
export const getEditFormList = ({ search }) => {
    return instance.get(`/api/edit-forms`).catch((err) => {
        throw err;
    });
};

// Edit Form정보 조회
export const getEditForm = (formSeq) => {
    return instance.get(`/api/edit-forms/${formSeq}`).catch((err) => {
        throw err;
    });
};

// Form ID 중복 체크
export const duplicateCheck = (formId) => {
    return instance.get(`/api/edit-forms/${formId}/exists`).catch((err) => {
        throw err;
    });
};

// Edit Form 저장
export const postEditForm = ({ formSeq, partSeq, partJson }) => {
    return instance.post(`/api/edit-forms/${formSeq}/parts/${partSeq}`, qs.stringify(partJson)).catch((err) => {
        throw err;
    });
};

// Edit Form 수정
export const putEditForm = ({ formSeq, partSeq, partJson }) => {
    return instance.put(`/api/edit-forms/${formSeq}/parts/${partSeq}`, qs.stringify(partJson)).catch((err) => {
        throw err;
    });
};

// Edit Form 삭제
export const deleteEditForm = ({ formSeq }) => {
    return instance.delete(`/api/edit-forms/${formSeq}`).catch((err) => {
        throw err;
    });
};
