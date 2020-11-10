import qs from 'qs';
import instance from '../commons/axios';

// 기자관리 목록 조회
export const getReporterList = ({ search }) => {
    return instance.get(`/api/reporter?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 기자조회 조회
export const getReporter = (repSeq) => {
    return instance.get(`/api/reporter/${repSeq}`).catch((err) => {
        throw err;
    });
};

//  그룹 수정
export const putReporter = ({ reporter }) => {
    console.log('iiiiiiiiiiiiiiiiiiiiiisert::' + decodeURIComponent(qs.stringify(reporter)));

    return instance.put(`/api/reporter/${reporter.repSeq}`, qs.stringify(reporter)).catch((err) => {
        throw err;
    });
};
