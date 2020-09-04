import qs from 'qs';
import client from './client';

export const menu = () => {
    return client.get('/api/auth/menus');
};

// 로그인
export const loginJwt = ({ userId, userPassword }) => {
    return client
        .post(
            '/loginJwt',
            {
                userId,
                userPassword
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// 로그아웃
export const logout = () => {
    return client.get('/logout').catch((err) => {
        throw err;
    });
};

// 매체목록 조회
export const getMedias = () => {
    return client.get('/api/domains/medias').catch((err) => {
        throw err;
    });
};

// 도메인목록 조회 : 권한 내에서 조회. 페이징 없음.
export const getDomains = ({ search }) => {
    return client.get(`/api/auth/domains?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 메뉴목록 조회 : 권한 내에서 조회
export const getMenus = () => {
    return client.get('/api/auth/menus').catch((err) => {
        throw err;
    });
};
