import instance from '@store/commons/axios';
import qs from 'qs';

export const getAbTestList = (search) => {
    const queryString = qs.stringify(search);
    return instance(`api/ab-test?${queryString}`).catch((error) => {
        throw error;
    });
};
