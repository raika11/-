import instance from '@store/commons/axios';
import qs from 'qs';

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
    return instance.put(`/api/polls/${id}?${qs.stringify(param)}`).catch((err) => {
        throw err;
    });
};

export const postPoll = (id, param) => {
    return instance.post(`/api/polls/${id}?${qs.stringify(param)}`).catch((err) => {
        throw err;
    });
};
