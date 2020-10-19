import qs from 'qs';
import instance from '@store/commons/axios';

// 템플릿 목록 조회
export const getTemplateList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/templates?${queryString}`).catch((err) => {
        throw err;
    });
};

// 템플릿 조회
export const getTemplate = ({ templateSeq }) => {
    return instance.get(`/api/templates/${templateSeq}`).catch((err) => {
        throw err;
    });
};
