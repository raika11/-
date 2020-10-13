import qs from 'qs';
import instance from '../commons/axios';

// 도메인목록 조회
export const getDomains = ({ search }) => {
    return instance.get(`/api/domains?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 도메인정보 조회
export const getDomain = (domainId) => {
    return instance.get(`/api/domains/${domainId}`).catch((err) => {
        throw err;
    });
};

// 도메인아이디 중복 체크
export const duplicateCheck = (domainId) => {
    return instance.get(`/api/domains/${domainId}/duplicateCheck`).catch((err) => {
        throw err;
    });
};

// 도메인 저장
export const postDomain = ({ domain }) => {
    return instance.post('/api/domains', qs.stringify(domain)).catch((err) => {
        throw err;
    });
};

// 도메인 수정
export const putDomain = ({ domain }) => {
    return instance.put(`/api/domains/${domain.domainId}`, qs.stringify(domain)).catch((err) => {
        throw err;
    });
};

// 관련아이템 확인
export const hasRelations = ({ domainId }) => {
    return instance.get(`/api/domains/${domainId}/hasRelations`).catch((err) => {
        throw err;
    });
};

// 도메인 삭제
export const deleteDomain = ({ domainId }) => {
    return instance.delete(`/api/domains/${domainId}`).catch((err) => {
        throw err;
    });
};
