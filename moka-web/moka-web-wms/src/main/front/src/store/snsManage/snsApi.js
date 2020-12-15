import qs from 'qs';
import instance from '@store/commons/axios';

export const getSNSMetaList = ({ search }) => {
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

export const putSnsMeta = (totalId, params) => {
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

export const postSnsPublish = (params) => {
    return instance.post('/api/sns/publish', qs.stringify(params)).catch((err) => {
        throw err;
    });
};
