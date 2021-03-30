import qs from 'qs';
import instance from '@store/commons/axios';

// 작업 실행 통계 목록 조회
export const getJobStatistic = ({ search }) => {
    return instance.get(`/api/schedule-server/job-statistic?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 작업 실행 현황 목록 조회
export const getJobStatisticSearch = ({ search }) => {
    return instance.get(`/api/schedule-server/job-statistic/search?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 배포 서버 목록 조회(검색 조건 코드)
export const getDistributeServerCode = () => {
    return instance.get(`/api/schedule-server/distribute-server-code`).catch((err) => {
        throw err;
    });
};

// 작업 목록 조회
export const getJobList = ({ search }) => {
    return instance.get(`/api/schedule-server/job?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 작업 상세 조회
export const getJob = (jobSeq) => {
    return instance.get(`/api/schedule-server/job/${jobSeq}`).catch((err) => {
        throw err;
    });
};

// 작업 등록
export const postJob = ({ job }) => {
    return instance.post(`/api/schedule-server/job`, qs.stringify(job)).catch((err) => {
        throw err;
    });
};

// 작업 수정
export const putJob = ({ job }) => {
    return instance.put(`/api/schedule-server/job/${job.jobSeq}`, qs.stringify(job)).catch((err) => {
        throw err;
    });
};

// 작업 삭제
export const deleteJob = ({ jobSeq }) => {
    return instance.put(`/api/schedule-server/job/${jobSeq}/delete`).catch((err) => {
        throw err;
    });
};

// 삭제 작업 목록 조회
export const getDeleteJobList = ({ search }) => {
    return instance.get(`/api/schedule-server/job-deleted?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 삭제 작업 상세 조회
export const getDeleteJob = (jobSeq) => {
    return instance.get(`/api/schedule-server/job-deleted/${jobSeq}`).catch((err) => {
        throw err;
    });
};

// 삭제된 작업 복원
export const putRecoverJob = (jobSeq) => {
    return instance.put(`/api/schedule-server/job-deleted/${jobSeq}/recover`).catch((err) => {
        throw err;
    });
};

// 배포 서버 목록 조회
export const getDistributeServerList = ({ search }) => {
    return instance.get(`/api/schedule-server/distribute-server?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 배포 서버 상세 조회
export const getDistributeServer = (serverSeq) => {
    return instance.get(`/api/schedule-server/distribute-server/${serverSeq}`).catch((err) => {
        throw err;
    });
};

// 배포 서버 등록
export const postDistributeServer = ({ server }) => {
    return instance.post(`/api/schedule-server/distribute-server`, qs.stringify(server)).catch((err) => {
        throw err;
    });
};

// 배포 서버 수정
export const putDistributeServer = ({ server }) => {
    return instance.put(`/api/schedule-server/distribute-server/${server.serverSeq}`, qs.stringify(server)).catch((err) => {
        throw err;
    });
};

// 배포 서버 삭제
export const deleteDistributeServer = ({ serverSeq }) => {
    return instance.put(`/api/schedule-server/distribute-server/${serverSeq}/delete`).catch((err) => {
        throw err;
    });
};

// 작업코드 목록조회
export const getJobCode = () => {
    return instance.get(`/api/schedule-server/job-code`).catch((err) => {
        throw err;
    });
};

// 작업예약 목록조회
export const getJobHistoryList = ({ search }) => {
    return instance.get(`/api/schedule-server/job-history?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 작업예약 상세조회
export const getHistoryJob = (seqNo) => {
    return instance.get(`/api/schedule-server/job-history/${seqNo}`).catch((err) => {
        throw err;
    });
};
