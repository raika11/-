import instance from '@store/commons/axios';
import qs from 'qs';

export const getPollList = ({ search }) => {
    const queryString = qs.stringify(search, { arrayFormat: 'repeat' });
    return instance.get(`/api/polls?${queryString}`).catch((err) => {
        throw err;
    });
};

export const getPoll = (id) => {
    return instance.get(`/api/polls/${id}`).catch((err) => {
        throw err;
    });
};

export const putPoll = (id, param) => {
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

export const deletePoll = (pollSeq) => {
    return instance.put(`/api/polls/${pollSeq}/used?status=D`).catch((err) => {
        throw err;
    });
};
