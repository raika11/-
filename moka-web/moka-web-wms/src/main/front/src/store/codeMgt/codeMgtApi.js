import qs from 'qs';
import instance from '@store/commons/axios';

// 그룹 목록 조회
export const getCodeMgtGrpList = ({ grpSearch }) => {
    const queryString = qs.stringify(grpSearch);
    return instance.get(`/api/codeMgtGrps?${queryString}`).catch((err) => {
        throw err;
    });
};

// 코드 목록 조회
export const getCodeMgtList = ({ cdSearch }) => {
    const queryString = qs.stringify(cdSearch);
    return instance.get(`/api/codeMgtGrps/${cdSearch.grpCd}/codeMgts?${queryString}`).catch((err) => {
        throw err;
    });
};

// 그룹 상세 조회
export const getCodeMgtGrp = (grpSeq) => {
    return instance.get(`/api/codeMgtGrps/${grpSeq}`).catch((err) => {
        throw err;
    });
};

// 코드 상세 조회
export const getCodeMgt = (cdSeq) => {
    return instance.get(`/api/codeMgtGrps/codeMgts/${cdSeq}`).catch((err) => {
        throw err;
    });
};

// 그룹 등록
export const postCodeMgtGrp = ({ codeMgtGrp }) => {
    return instance.post('/api/codeMgtGrps', qs.stringify(codeMgtGrp)).catch((err) => {
        throw err;
    });
};

// 코드 등록
export const postCodeMgt = ({ codeMgt }) => {
    const codeMgts = {
        ...codeMgt,
        codeMgtGrp: undefined,
        grpCd: codeMgt.grpCd,
        seqNo: codeMgt.seqNo,
        // 'codeMgt.grpCd': codeMgt.codeTypeSeq
    };
    return instance.post('/api/codeMgtGrps/codeMgts', qs.stringify(codeMgts)).catch((err) => {
        throw err;
    });
};

// 그룹 수정
export const putCodeMgtGrp = ({ codeMgtGrp }) => {
    return instance.put(`/api/codeMgtGrps/${codeMgtGrp.grpSeq}`, qs.stringify(codeMgtGrp)).catch((err) => {
        throw err;
    });
};

// 코드 수정
// export const putEtccode = ({ etccode }) => {
//     const etccodeSet = {
//         ...etccode,
//         'etccodeType.codeTypeId': etccode.codeTypeId,
//         'etccodeType.codeTypeSeq': etccode.codeTypeSeq
//     };
//     return instance
//         .put(`/api/codeMgtGrps/codeMgts/${etccodeSet.seq}`, qs.stringify(etccodeSet))
//         .catch((err) => {
//             throw err;
//         });
// };

// 그룹 삭제
export const deleteCodeMgtGrp = (grpSeq) => {
    return instance.delete(`/api/codeMgtGrps/${grpSeq}`).catch((err) => {
        throw err;
    });
};

// 코드 삭제
export const deleteCodeMgt = (cdSeq) => {
    return instance.delete(`/api/codeMgtGrps/codeMgts/${cdSeq}`).catch((err) => {
        throw err;
    });
};

// 코드 목록 조회(페이징 없음)
export const getUseCodeMgtList = (grpCd) => {
    return instance.get(`/api/codeMgtGrps/${grpCd}/codeMgts`).catch((err) => {
        throw err;
    });
};
