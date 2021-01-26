import instance from '@store/commons/axios';
import qs from 'qs';
import { objectToFormData } from '@utils/convertUtil';

export const getPollList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/polls?${queryString}`).catch((err) => {
        throw err;
    });
};

export const getPoll = (id) => {
    return instance.get(`/api/polls/${id}`).catch((err) => {
        throw err;
    });
};

export const pullPoll = (id, param) => {
    return instance
        .put(`/api/polls/${id}`, param, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

export const postPoll = (param) => {
    return instance
        .post('/api/polls', param, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
