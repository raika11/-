import instance from '../commons/axios';
import qs from 'qs';
// 로그인
export const loginJwt = (userId, userPassword) => {
    return instance
        .post(
            '/loginJwt',
            { userId, userPassword },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        .catch((err) => {
            throw err;
        });
};

// 로그아웃
export const logout = () => {
    return instance.get('/logout').catch((err) => {
        throw err;
    });
};

// BackOffice 사용자 조회
export const getBackOfficeUser = (memberId) => {
    return instance.get(`/api/member-join/${memberId}`).catch((err) => {
        throw err;
    });
};

// 그룹웨어 사용자 조회
export const getGroupWareUser = (groupWareUserId) => {
    return instance.get(`/api/member-join/groupware-users/${groupWareUserId}`).catch((err) => {
        throw err;
    });
};

// SMS 인증문자 요청
export const getSmsRequest = ({ payload }) => {
    const queryString = qs.stringify(payload);
    return instance.get(`/api/member-join/${payload.memberId}/sms-request?${queryString}`).catch((err) => {
        throw err;
    });
};

// 본인인증 해제
export const approvalRequest = ({ payload }) => {
    const queryString = qs.stringify(payload);
    return instance.get(`/api/member-join/${payload.memberId}/approval-request?${queryString}`).catch((err) => {
        throw err;
    });
};

// 관리자 해제 요청
export const unlockRequest = ({ payload }) => {
    const queryString = qs.stringify(payload);
    return instance.get(`/api/member-join/${payload.memberId}/unlock-request?${queryString}`).catch((err) => {
        throw err;
    });
};

// 메뉴목록 조회 : 권한 내에서 조회
export const getUserMenuTree = () => {
    return instance.get('/api/members/menus').catch((err) => {
        throw err;
    });
};
