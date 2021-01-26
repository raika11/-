import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

export const getSnsMetaList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/sns?${queryString}`).catch((err) => {
        throw err;
    });
};

export const getSnsMeta = (totalId) => {
    return instance.get(`/api/sns/${totalId}`).catch((err) => {
        throw err;
    });
};

export const putSnsMeta = (totalId, data) => {
    return instance
        .put(`/api/sns/${totalId}`, objectToFormData(data), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

export const postSnsPublish = (params) => {
    return instance.post('/api/sns/publish', qs.stringify(params)).catch((err) => {
        throw err;
    });
};

export const getSnsSendArticleList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/sns/send-articles?${queryString}`).catch((err) => {
        throw err;
    });
};
