import qs from 'qs';
import instance from '../commons/axios';

// 기자관리 목록 조회
export const getReporterList = ({ search }) => {
    return instance.get(`/api/reporters?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 전체 기자 목록 조회
export const getAllReporterList = () => {
    const search = {
        usePaging: 'N',
    };
    return instance.get(`/api/reporters?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 기자관리 조회
export const getReporter = (repSeq) => {
    return instance.get(`/api/reporters/${repSeq}`).catch((err) => {
        throw err;
    });
};

//  그룹 수정
export const putReporter = ({ reporter }) => {
    return instance.put(`/api/reporters/${reporter.repSeq}`, qs.stringify(reporter)).catch((err) => {
        throw err;
    });
};
