import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 이슈 목록 조회
export const getIssueList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/issue?${queryString}`).catch((err) => {
        throw err;
    });
};

// 이슈 컨텐츠 목록 조회
export const getIssueContentsList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/issue/${search.pkgSeq}?${queryString}`).catch((err) => {
        throw err;
    });
};

// 이슈 조회
export const getIssue = (pkgSeq) => {
    return instance.get(`/api/issue/${pkgSeq}`).catch((err) => {
        throw err;
    });
};

// 이슈 조회 (화면 기준)
export const getIssueGroupByOrdNo = (pkgSeq) => {
    return instance.get(`/api/issue/${pkgSeq}/group-by-ordno`).catch((err) => {
        throw err;
    });
};

// 이슈 타이틀 중복검사
export const existsIssueTitle = ({ pkgTitle }) => {
    return instance.get(`/api/issue/${pkgTitle}/exists`).catch((err) => {
        throw err;
    });
};

// 이슈 등록 application/json
export const postIssue = ({ pkg }) => {
    return instance
        .post('/api/issue', pkg, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 이슈 등록 (화면 기준) application/json
export const postIssueGroupByOrdno = ({ pkg }) => {
    return instance
        .post('/api/issue/group-by-ordno', pkg, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 이슈 수정 application/json
export const putIssue = ({ pkg }) => {
    return instance
        .put(`/api/issue/${pkg.pkgSeq}`, pkg, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 이슈 수정 (화면 기준) application/json
export const putIssueGroupByOrdno = ({ pkg }) => {
    return instance
        .put(`/api/issue/${pkg.pkgSeq}/group-by-ordno`, pkg, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 이슈 종료
export const finishIssue = ({ pkgSeq }) => {
    return instance.put(`/api/issue/${pkgSeq}/finish`).catch((err) => {
        throw err;
    });
};

// 이슈 데스킹 임시저장(폼데이터)
export const saveIssueDesking = ({ pkgSeq, compNo, issueDeskingList }) => {
    return instance
        .post(`/api/issue/${pkgSeq}/desking/${compNo}/save`, objectToFormData(issueDeskingList), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
