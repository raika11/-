import qs from 'qs';
import client from './client';
import { TEMPLATE_IMAGE_PREFIX } from '~/constants';
import { convertJsObjectToFormData } from '~/utils/convertUtil';

// 템플릿목록 조회
export const getTemplates = ({ search }) => {
    const queryString = qs.stringify(search);
    return client.get(`/api/templates?${queryString}`).catch((err) => {
        throw err;
    });
};

// 템플릿정보 조회
export const getTemplate = ({ templateSeq }) => {
    return client.get(`/api/templates/${templateSeq}`).catch((err) => {
        throw err;
    });
};

// 템플릿 저장(폼데이터)
export const postTemplate = ({ template }) => {
    return client
        .post(
            '/api/templates',
            convertJsObjectToFormData({
                ...template,
                domain: undefined,
                'domain.domainId': template.domainId
            }),
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// 템플릿 수정(폼데이터)
export const putTemplate = ({ template }) => {
    return client
        .put(
            `/api/templates/${template.templateSeq}`,
            convertJsObjectToFormData({
                ...template,
                domain: undefined,
                'domain.domainId': template.domainId,
                templateThumbnail: template.templateThumbnail
                    ? template.templateThumbnail.replace(TEMPLATE_IMAGE_PREFIX, '')
                    : undefined
            }),
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
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
        domainId: domainId !== 'all' ? domainId : undefined
    });
    return client.post(`/api/templates/${templateSeq}/copy?${copySet}`).catch((err) => {
        throw err;
    });
};

// 템플릿 삭제
export const deleteTemplate = ({ templateSeq }) => {
    return client.delete(`/api/templates/${templateSeq}`).catch((err) => {
        throw err;
    });
};

// 템플릿 히스토리 조회
export const getHistories = ({ search }) => {
    const queryString = qs.stringify(search);
    return client
        .get(`/api/templates/${search.templateSeq}/histories?${queryString}`)
        .catch((err) => {
            throw err;
        });
};

// 관련 아이템 확인
export const hasRelations = ({ templateSeq }) => {
    return client.get(`/api/templates/${templateSeq}/hasRelations`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 조회
export const getRelations = ({ search }) => {
    const queryString = qs.stringify(search);
    return client
        .get(`/api/templates/${search.templateSeq}/relations?${queryString}`)
        .catch((err) => {
            throw err;
        });
};
