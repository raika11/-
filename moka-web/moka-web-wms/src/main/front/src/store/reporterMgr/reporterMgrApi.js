import qs from 'qs';
import instance from '../commons/axios';

// 기자관리 목록 조회
export const getReporterMgrList = ({ search }) => {
    return instance.get(`/api/groups?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 기자조회 조회
export const getReporterMgr = (repSeq) => {
    return instance.get(`/api/ReporterMgr/${repSeq}`).catch((err) => {
        throw err;
    });
};

// 기자관리 중복 체크
export const duplicateReporterMgrCheck = (repSeq) => {
    return instance.get(`/api/ReporterMgr/${repSeq}/exists`).catch((err) => {
        throw err;
    });
};

// // 그룹 내 속한 멤버 존재 여부
// export const hasRelationList = (groupCd) => {
//     return instance.get(`/api/groups/${groupCd}/has-members`).catch((err) => {
//         throw err;
//     });
// };

// 그룹 등록
// export const postGroup = ({ group }) => {
//     console.log("iiiiiiiiiiiiiiiiiiiiiisert::" + decodeURIComponent(qs.stringify(group)));
//     return instance.post('/api/groups', qs.stringify(group)).catch((err) => {
//         throw err;
//     });
// };

//  그룹 수정
export const putReporterMgr = ({ reporterMgr }) => {
    console.log('iiiiiiiiiiiiiiiiiiiiiisert::' + decodeURIComponent(qs.stringify(reporterMgr)));

    return instance.put(`/api/reportermgr/${reporterMgr.repSeq}`, qs.stringify(reporterMgr)).catch((err) => {
        throw err;
    });
};

// 그룹 삭제 완료이후 삭제예정
// export const deleteGroup = ({ groupCd }) => {
//     return instance.delete(`/api/groups/${groupCd}`).catch((err) => {
//         throw err;
//     });
// };
