import qs from 'qs';
import instance from '../commons/axios';

// 사용자목록 조회
export const getMemberList = ({ search }) => {
    return instance.get(`/api/members?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 사용자정보 조회
export const getMember = (memberId) => {
    return instance.get(`/api/members/${memberId}`).catch((err) => {
        throw err;
    });
};

// 사용자아이디 중복 체크
export const duplicateCheck = (memberId) => {
    return instance.get(`/api/members/${memberId}/exists`).catch((err) => {
        throw err;
    });
};

// 사용자 저장
export const postMember = ({ member }) => {
    return instance.post('/api/members', qs.stringify(member)).catch((err) => {
        throw err;
    });
};

// 사용자 수정
export const putMember = ({ member }) => {
    return instance.put(`/api/members/${member.memberId}`, qs.stringify(member)).catch((err) => {
        throw err;
    });
};

// 로그인 이력 조회
export const getLoginHistoryList = ({ historySearch }) => {
    return instance.get(`/api/members/${historySearch.memberId}/login-historys?${qs.stringify(historySearch)}`).catch((err) => {
        throw err;
    });
};

// 사용자 메뉴 권한 수정
export const updateMemberMenuAuth = (memberId, changeMenuAuthList) => {
    return instance.put(`/api/members/${memberId}/menu-auths`, changeMenuAuthList).catch((err) => {
        throw err;
    });
};
