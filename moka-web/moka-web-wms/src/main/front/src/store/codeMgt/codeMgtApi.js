import qs from 'qs';
import instance from '@store/commons/axios';

// 그룹 목록 조회
export const getCodeMgtGrpList = ({ grpSearch }) => {
    const queryString = qs.stringify(grpSearch);
    return instance.get(`/api/codemgt-grps?${queryString}`).catch((err) => {
        throw err;
    });
};

// 코드 목록 조회
export const getCodeMgtList = ({ cdSearch }) => {
    const queryString = qs.stringify(cdSearch);
    return instance.get(`/api/codemgt-grps/${cdSearch.grpCd}/codemgts?${queryString}`).catch((err) => {
        throw err;
    });
};

// 그룹 상세 조회
export const getCodeMgtGrp = (grpCd) => {
    return instance.get(`/api/codemgt-grps/${grpCd}`).catch((err) => {
        throw err;
    });
};

// 코드 상세 조회
export const getCodeMgt = (cdSeq) => {
    return instance.get(`/api/codemgt-grps/codemgts/${cdSeq}`).catch((err) => {
        throw err;
    });
};

// 그룹 등록
export const postCodeMgtGrp = ({ grp }) => {
    return instance.post('/api/codemgt-grps', qs.stringify(grp)).catch((err) => {
        throw err;
    });
};

// 코드 등록
export const postCodeMgt = ({ cd }) => {
    const codeMgts = {
        ...cd,
        'codeMgtGrp.seqNo': cd.codeMgtGrp.seqNo,
        'codeMgtGrp.grpCd': cd.codeMgtGrp.grpCd,
        codeMgtGrp: undefined,
    };
    return instance.post('/api/codemgt-grps/codemgts', qs.stringify(codeMgts)).catch((err) => {
        throw err;
    });
};

// 그룹 수정
export const putCodeMgtGrp = ({ grp }) => {
    return instance.put(`/api/codemgt-grps/${grp.grpSeq}`, qs.stringify(grp)).catch((err) => {
        throw err;
    });
};

// 코드 수정
export const putCodeMgt = ({ cd }) => {
    const codeMgts = {
        ...cd,
        'codeMgtGrp.seqNo': cd.codeMgtGrp.seqNo,
        'codeMgtGrp.grpCd': cd.codeMgtGrp.grpCd,
        codeMgtGrp: undefined,
    };
    return instance.put(`/api/codemgt-grps/codemgts/${codeMgts.seqNo}`, qs.stringify(codeMgts)).catch((err) => {
        throw err;
    });
};

// 그룹 삭제
export const deleteCodeMgtGrp = ({ grpSeq }) => {
    return instance.delete(`/api/codemgt-grps/${grpSeq}`).catch((err) => {
        throw err;
    });
};

// 코드 삭제
export const deleteCodeMgt = ({ cdSeq }) => {
    return instance.delete(`/api/codemgt-grps/codemgts/${cdSeq}`).catch((err) => {
        throw err;
    });
};

// 사용중인 코드 목록 조회(페이징 없음)
export const getUseCodeMgtList = (grpCd) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/use-codemgts`).catch((err) => {
        throw err;
    });
};

// 그룹 중복검사
export const getCodeMgtGrpDuplicateCheck = ({ grpCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/exists`).catch((err) => {
        throw err;
    });
};

// 코드 중복검사
export const getCodeMgtDuplicateCheck = ({ grpCd, dtlCd }) => {
    return instance.get(`/api/codemgt-grps/${grpCd}/${dtlCd}/exists`).catch((err) => {
        throw err;
    });
};
