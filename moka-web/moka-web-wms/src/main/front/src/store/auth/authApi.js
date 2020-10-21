import qs from 'qs';
import instance from '../commons/axios';

export const menu = () => {
    return instance.get('/api/auth/menus');
};

// 로그인
export const loginJwt = ({ userId, userPassword }) => {
    return instance
        .post(
            '/loginJwt',
            {
                userId,
                userPassword,
            },
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

// 메뉴목록 조회 : 권한 내에서 조회
export const getMenus = () => {
    return instance.get('/api/auth/menus').catch((err) => {
        throw err;
    });
};
