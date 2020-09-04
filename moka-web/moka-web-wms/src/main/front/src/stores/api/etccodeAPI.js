import qs from 'qs';
import client from './client';

// 코드목록조회
export const getEtccodeList = (param) => {
    // 그룹의 사용중인 코드목록조회(페이징 없음)
    if (typeof param === 'string') {
        return client.get(`/api/etccodeTypes/${param}/useEtccodes`).catch((err) => {
            throw err;
        });
    }
    // 그룹의 코드목록 조회(페이징 있음)
    const search = { ...param };
    return client
        .get(`/api/etccodeTypes/${search.codeTypeId}/etccodes?${qs.stringify(search)}`)
        .catch((err) => {
            throw err;
        });
};

// 그룹목록조회
export const getEtccodeTypeList = ({ search }) => {
    return client.get(`/api/etccodeTypes?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 그룹상세
export const getEtccodeType = (codeTypeSeq) => {
    return client.get(`/api/etccodeTypes/${codeTypeSeq}`).catch((err) => {
        throw err;
    });
};

// 그룹 등록
export const postEtccodeType = ({ etccodeType }) => {
    return client.post('/api/etccodeTypes', qs.stringify(etccodeType)).catch((err) => {
        throw err;
    });
};

// 그룹 수정
export const putEtccodeType = ({ etccodeType }) => {
    return client
        .put(`/api/etccodeTypes/${etccodeType.codeTypeSeq}`, qs.stringify(etccodeType))
        .catch((err) => {
            throw err;
        });
};

// 그룹 삭제
export const deleteEtccodeType = (codeTypeSeq) => {
    return client.delete(`/api/etccodeTypes/${codeTypeSeq}`).catch((err) => {
        throw err;
    });
};

// 코드상세
export const getEtccode = (seq) => {
    return client.get(`/api/etccodeTypes/etccodes/${seq}`).catch((err) => {
        throw err;
    });
};

// 코드 등록
export const postEtccode = ({ etccode }) => {
    const etccodeSet = {
        ...etccode,
        'etccodeType.codeTypeId': etccode.codeTypeId,
        'etccodeType.codeTypeSeq': etccode.codeTypeSeq
    };
    return client.post('/api/etccodeTypes/etccodes', qs.stringify(etccodeSet)).catch((err) => {
        throw err;
    });
};

// 코드 수정
export const putEtccode = ({ etccode }) => {
    const etccodeSet = {
        ...etccode,
        'etccodeType.codeTypeId': etccode.codeTypeId,
        'etccodeType.codeTypeSeq': etccode.codeTypeSeq
    };
    return client
        .put(`/api/etccodeTypes/etccodes/${etccodeSet.seq}`, qs.stringify(etccodeSet))
        .catch((err) => {
            throw err;
        });
};

// 코드 삭제
export const deleteEtccode = (seq) => {
    return client.delete(`/api/etccodeTypes/etccodes/${seq}`).catch((err) => {
        throw err;
    });
};
