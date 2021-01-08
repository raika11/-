import qs from 'qs';
import instance from '@store/commons/axios';

export const getSeoMetaList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/sns?${queryString}`).catch((err) => {
        throw err;
    });
};

export const getSeoMeta = (totalId) => {
    return instance.get(`/api/sns/${totalId}?snsType=JA`).catch((err) => {
        throw err;
    });
};

export const putSeoMeta = (totalId, params) => {
    return instance
        .put(`/api/sns/${totalId}?${qs.stringify(params)}`, null, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

export const postSeoPublish = (params) => {
    return instance.post('/api/sns/publish', qs.stringify(params)).catch((err) => {
        throw err;
    });
};
