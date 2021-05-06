import instance from '@store/commons/axios';
import qs from 'qs';

export const getAbTestList = (search) => {
    console.log(search);
    const queryString = qs.stringify(search);
    return instance.get(`/api/ab-test?${queryString}`).catch((error) => {
        throw error;
    });
};

export const getAbTest = (abtestSeq) => {
    return instance.get(`/api/ab-test/${abtestSeq}`).catch((error) => {
        throw error;
    });
};

export const postAbTest = ({ detail }) => {
    return instance
        .post('/api/ab-test', detail, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((error) => {
            throw error;
        });
};

export const putAbTest = ({ detail }) => {
    return instance
        .put(`/api/ab-test/${detail.abtestSeq}`, detail, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((error) => {
            throw error;
        });
};

export const putCloseAbtest = (abtestSeq) => {
    return instance
        .put(`/api/ab-test/close/${abtestSeq}`, null, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((error) => {
            throw error;
        });
};

export const deleteAbtest = (abtestSeq) => {
    return instance
        .put(`/api/ab-test/delete/${abtestSeq}`, null, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((error) => {
            throw error;
        });
};
