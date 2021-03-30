import qs from 'qs';
import instance from '@store/commons/axios';

export const getPackageList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/issue?${queryString}`).catch((err) => {
        throw err;
    });
};
