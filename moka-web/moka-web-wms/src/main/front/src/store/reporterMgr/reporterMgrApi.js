import qs from 'qs';
import instance from '../commons/axios';

// 그룹 목록 조회
export const getGroupList = ({ search }) => {
    return instance.get(`/api/groups?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 그룹 조회
export const getGroup = (groupCd) => {
    return instance.get(`/api/groups/${groupCd}`).catch((err) => {
        throw err;
    });
};

// 그룹코드 중복 체크
export const duplicateGroupCdCheck = (groupCd) => {
    return instance.get(`/api/groups/${groupCd}/exists`).catch((err) => {
        throw err;
    });
};

// 그룹 내 속한 멤버 존재 여부
export const hasRelationList = (groupCd) => {
    return instance.get(`/api/groups/${groupCd}/has-members`).catch((err) => {
        throw err;
    });
};

// 그룹 등록
export const postGroup = ({ group }) => {
    console.log("iiiiiiiiiiiiiiiiiiiiiisert::" + decodeURIComponent(qs.stringify(group)));
    return instance.post('/api/groups', qs.stringify(group)).catch((err) => {
        throw err;
    });
};

//  그룹 수정
export const putGroups = ({ group }) => {
    console.log("iiiiiiiiiiiiiiiiiiiiiisert::" + decodeURIComponent(qs.stringify(group)));

    return instance.put(`/api/groups/${group.groupCd}`, qs.stringify(group)).catch((err) => {
        throw err;
    });
};

// 그룹 삭제
export const deleteGroup = ({ groupCd }) => {
    return instance.delete(`/api/groups/${groupCd}`).catch((err) => {
        throw err;
    });
};
