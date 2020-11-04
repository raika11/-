import qs from 'qs';
import instance from '../commons/axios';

// 그룹 목록 조회
export const getGroupList = ({ search }) => {
    return instance.get(`/api/groups?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 그룹 조회
export const getGroup = (grpCd) => {
    return instance.get(`/api/groups/${grpCd}`).catch((err) => {
        throw err;
    });
};

// 그룹코드 중복 체크
export const duplicateGroupCdCheck = (grpCd) => {
    return instance.get(`/api/groups/${grpCd}/exists`).catch((err) => {
        throw err;
    });
};

// 그룹 내 속한 멤버 존재 여부
export const hasRelationList = (grpCd) => {
    return instance.get(`/api/groups/${grpCd}/has-members`).catch((err) => {
        throw err;
    });
};

// 그룹 등록
export const postGroup = ({ grp }) => {
    return instance.post('/api/groups', qs.stringify(grp)).catch((err) => {
        throw err;
    });
};

//  그룹 수정
export const putGroups = ({ grp }) => {
    return instance.put(`/api/groups/${grp.grpCd}`, qs.stringify(grp)).catch((err) => {
        throw err;
    });
};

// 그룹 삭제
export const deleteGroup = ({ grpCd }) => {
    return instance.delete(`/api/groups/${grpCd}`).catch((err) => {
        throw err;
    });
};
