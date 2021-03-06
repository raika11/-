import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

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

// 템플릿 저장(폼데이터)
export const postTemplate = ({ template }) => {
    return instance
        .post(
            '/api/templates',
            objectToFormData({
                ...template,
                domain: undefined,
                'domain.domainId': template.domain.domainId,
            }),
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
        .catch((err) => {
            throw err;
        });
};

// 템플릿 수정(폼데이터)
export const putTemplate = ({ template }) => {
    return instance
        .put(
            `/api/templates/${template.templateSeq}`,
            objectToFormData({
                ...template,
                domain: undefined,
                'domain.domainId': template.domain.domainId,
            }),
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
        .catch((err) => {
            throw err;
        });
};

// 템플릿 복사
export const copyTemplate = ({ templateSeq, templateName, domainId }) => {
    const copySet = qs.stringify({
        templateSeq,
        templateName,
        domainId,
    });
    return instance.post(`/api/templates/${templateSeq}/copy?${copySet}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 확인
export const hasRelationList = ({ templateSeq }) => {
    return instance.get(`/api/templates/${templateSeq}/has-relations`).catch((err) => {
        throw err;
    });
};

// 템플릿 삭제
export const deleteTemplate = ({ templateSeq }) => {
    return instance.delete(`/api/templates/${templateSeq}`).catch((err) => {
        throw err;
    });
};
