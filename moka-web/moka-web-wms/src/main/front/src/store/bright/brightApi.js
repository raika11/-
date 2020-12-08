import qs from 'qs';
import instance from '../commons/axios';

// OVP 목록조회
export const getVideoList = ({ search }) => {
    return instance.get(`/api/bright/videos?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Lives 목록조회
export const getLiveList = () => {
    return instance.get(`/api/bright/lives`).catch((err) => {
        throw err;
    });
};
