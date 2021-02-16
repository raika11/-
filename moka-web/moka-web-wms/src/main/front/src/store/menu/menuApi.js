import qs from 'qs';
import instance from '../commons/axios';

// 메뉴목록 조회(LIST)
export const getMenuList = ({ search }) => {
    return instance.get(`/api/menus?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 메뉴정보 조회
export const getMenu = (menuSeq) => {
    return instance.get(`/api/menus/${menuSeq}`).catch((err) => {
        throw err;
    });
};

export const getMenuTree = (search) => {
    return instance.get(`/api/menus/tree?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 메뉴ID 중복 체크
export const duplicateCheckId = (menuId) => {
    return instance.get(`/api/menus/${menuId}/exists`).catch((err) => {
        throw err;
    });
};

// 메뉴 저장
export const postMenu = ({ menu }) => {
    return instance.post('/api/menus', qs.stringify(menu)).catch((err) => {
        throw err;
    });
};

// 메뉴 수정
export const putMenu = ({ menu }) => {
    return instance.put(`/api/menus/${menu.menuSeq}`, qs.stringify(menu)).catch((err) => {
        throw err;
    });
};

// 메뉴를 사용하고있는 그룹 및 사용자 체크
export const existAuth = (menuId) => {
    return instance.get(`/api/menus/${menuId}/exist-auth`).catch((err) => {
        throw err;
    });
};

// 메뉴 삭제
export const deleteMenu = ({ menuId }) => {
    return instance.delete(`/api/menus/${menuId}`).catch((err) => {
        throw err;
    });
};

export const changeOrderChildren = (parentId, children) => {
    return instance.put(`api/menus/${parentId}/change-order-children`, children).catch((err) => {
        throw err;
    });
};
