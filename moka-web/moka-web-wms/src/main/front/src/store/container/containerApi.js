import qs from 'qs';
import instance from '@store/commons/axios';

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

// 컨테이너 저장
export const postContainer = ({ container }) => {
    const containerSet = {
        ...container,
        'domain.domainId': container.domain.domainId,
    };
    delete containerSet.domain;
    return instance.post('/api/containers', qs.stringify(containerSet)).catch((err) => {
        throw err;
    });
};

// 컨테이너 수정
export const putContainer = ({ container }) => {
    const containerSet = {
        ...container,
        'domain.domainId': container.domain.domainId,
    };
    delete containerSet.domain;
    return instance.put(`/api/containers/${containerSet.containerSeq}`, qs.stringify(containerSet)).catch((err) => {
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
