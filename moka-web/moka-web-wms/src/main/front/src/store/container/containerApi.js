import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 컨테이너 목록 조회
export const getContainerList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/containers?${queryString}`).catch((err) => {
        throw err;
    });
};

// 컨테이너 조회
export const getContainer = ({ containerSeq }) => {
    return instance.get(`/api/containers/${containerSeq}`).catch((err) => {
        throw err;
    });
};

// 컨테이너 등록(폼데이터)
export const postContainer = ({ container }) => {
    return instance
        .post('/api/containers', objectToFormData(container), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컨테이너 수정(폼데이터)
export const putContainer = ({ container }) => {
    return instance
        .put(`/api/containers/${container.containerSeq}`, objectToFormData(container), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 관련 아이템 확인
export const hasRelationList = ({ containerSeq }) => {
    return instance.get(`/api/containers/${containerSeq}/has-relations`).catch((err) => {
        throw err;
    });
};

// 컨테이너 삭제
export const deleteContainer = ({ containerSeq }) => {
    return instance.delete(`/api/containers/${containerSeq}`).catch((err) => {
        throw err;
    });
};
