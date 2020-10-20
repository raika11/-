import qs from 'qs';
import instance from '@store/commons/axios';

// 코드 그룹 목록 조회
export const getCodeMgtGrpList = ({ grpSearch }) => {
    const queryString = qs.stringify(grpSearch);
    return instance.get(`/api/codeMgtGrps?${queryString}`).catch((err) => {
        throw err;
    });
};

// 코드 목록 조회(페이징 없음)
export const getUseCodeMgtList = (grpCd) => {
    return instance.get(`/api/codeMgtGrps/${grpCd}/useCodeMgts`).catch((err) => {
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
