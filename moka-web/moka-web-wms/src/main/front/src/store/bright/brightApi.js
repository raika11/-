import qs from 'qs';
import instance from '../commons/axios';
import { objectToFormData } from '@utils/convertUtil';

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

// OVP 저장
export const saveOvp = ({ ovpdata }) => {
    return instance
        .post(`/api/ovp`, objectToFormData(ovpdata), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
