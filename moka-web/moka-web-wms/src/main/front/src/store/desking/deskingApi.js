import qs from 'qs';
import instance from '@store/commons/axios';

// Work컴포넌트목록 조회(복수)
export const getComponentWorkList = ({ areaSeq }) => {
    return instance.get(`/api/desking/${areaSeq}`).catch((err) => {
        throw err;
    });
};
