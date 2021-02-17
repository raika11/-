import qs from 'qs';
import instance from '@store/commons/axios';

// 그룹 목록 조회
export const getGrpList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/codemgt-grps?${queryString}`).catch((err) => {
        throw err;
    });
};

// 그룹 상세 조회
export const getGrp = ({ grpCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}`).catch((err) => {
        throw err;
    });
};

// 그룹 등록 (application/json)
export const postGrp = ({ grp }) => {
    return instance
        .post('/api/codemgt-grps', grp, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 그룹 수정 (application/json)
export const putGrp = ({ grp }) => {
    return instance
        .put(`/api/codemgt-grps/${grp.seqNo}`, grp, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 그룹 삭제
export const deleteGrp = ({ seqNo }) => {
    return instance.delete(`/api/codemgt-grps/${seqNo}`).catch((err) => {
        throw err;
    });
};

// 그룹 중복검사
export const existsGrp = ({ grpCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/exists`).catch((err) => {
        throw err;
    });
};

// 상세코드 목록 조회
export const getDtlList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/codemgt-grps/${search.grpCd}/codemgts?${queryString}`).catch((err) => {
        throw err;
    });
};

// 상세코드 상세 조회
export const getDtl = ({ seqNo }) => {
    return instance.get(`/api/codemgt-grps/codemgts/${seqNo}`).catch((err) => {
        throw err;
    });
};

// 상세코드 등록 (application/json)
export const postDtl = ({ dtl }) => {
    return instance
        .post('/api/codemgt-grps/codemgts', dtl, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 상세코드 수정 (application/json)
export const putDtl = ({ dtl }) => {
    return instance
        .put(`/api/codemgt-grps/codemgts/${dtl.seqNo}`, dtl, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 상세코드 삭제
export const deleteDtl = ({ seqNo }) => {
    return instance.delete(`/api/codemgt-grps/codemgts/${seqNo}`).catch((err) => {
        throw err;
    });
};

// 사용중인 상세코드 목록 조회(페이징 없음)
export const getUseDtlList = ({ grpCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/use-codemgts`).catch((err) => {
        throw err;
    });
};

// 상세코드 중복검사
export const existsDtl = ({ grpCd, dtlCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/${dtlCd}/exists`).catch((err) => {
        throw err;
    });
};

export const getSpecialCharCode = ({ grpCd, dtlCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/special-char/${dtlCd}`).catch((err) => {
        throw err;
    });
};

export const putSpecialCharCode = ({ grpCd, dtlCd, cdNm }) => {
    return instance.put(`/api/codemgt-grps/${grpCd}/special-char?${qs.stringify({ dtlCd, cdNm })}`).catch((err) => {
        throw err;
    });
};
