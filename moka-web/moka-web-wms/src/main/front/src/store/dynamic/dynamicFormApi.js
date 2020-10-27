import qs from 'qs';
import instance from '../commons/axios';

// Dynamic Form목록 조회
export const getDynamicFormList = ({ search }) => {
    return instance.get(`/api/dynamic-form?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Dynamic Form정보 조회
export const getDynamicForm = (channelName) => {
    return instance.get(`/api/dynamic-form/${channelName}`).catch((err) => {
        throw err;
    });
};

// Dynamic Form 저장
export const postDynamicForm = ({ channelId, dynamic }) => {
    console.log(dynamic);
    return instance.post(`/api/app/dynamic-form/${channelId}`, qs.stringify(dynamic.fieldGroups)).catch((err) => {
        throw err;
    });
};

// Dynamic Form 수정
export const putDynamicForm = ({ channelId, part }) => {
    return instance.put(`/api/dynamic-form/${channelId}`, qs.stringify(part)).catch((err) => {
        throw err;
    });
};

// Dynamic Form 삭제
export const deleteDynamicForm = ({ channelId }) => {
    return instance.delete(`/api/dynamic-form/${channelId}`).catch((err) => {
        throw err;
    });
};
