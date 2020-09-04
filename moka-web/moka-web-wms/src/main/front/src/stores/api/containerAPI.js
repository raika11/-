import qs from 'qs';
import client from './client';

// 컨테이너목록 조회
export const getContainerList = ({ search }) => {
    return client.get(`/api/containers?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 컨테이너정보 조회
export const getContainer = (containerSeq) => {
    return client.get(`/api/containers/${containerSeq}`).catch((err) => {
        throw err;
    });
};

// 컨테이너 저장
export const postContainer = ({ container }) => {
    const containerSet = {
        ...container,
        'domain.domainId': container.domain.domainId
    };
    delete containerSet.domain;
    return client.post('/api/containers', qs.stringify(containerSet)).catch((err) => {
        throw err;
    });
};

// 컨테이너 수정
export const putContainer = ({ container }) => {
    const containerSet = {
        ...container,
        'domain.domainId': container.domain.domainId
    };
    delete containerSet.domain;
    return client
        .put(`/api/containers/${containerSet.containerSeq}`, qs.stringify(containerSet))
        .catch((err) => {
            throw err;
        });
};

// 컨테이너 삭제
export const deleteContainer = (containerSeq) => {
    return client.delete(`/api/containers/${containerSeq}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 조회
export const getRelationList = ({ search }) => {
    return client
        .get(`/api/containers/${search.relSeq}/relations?${qs.stringify(search)}`)
        .catch((err) => {
            throw err;
        });
};

// 히스토리 목록 조회
export const getHistoryList = ({ search }) => {
    return client
        .get(`/api/containers/${search.seq}/histories?${qs.stringify(search)}`)
        .catch((err) => {
            throw err;
        });
};

// 관련 아이템 확인
export const hasRelations = (containerSeq) => {
    return client.get(`/api/containers/${containerSeq}/hasRelations`).catch((err) => {
        throw err;
    });
};
