import qs from 'qs';
import instance from '@store/commons/axios';

/**
 * 배포 서버 목록 조회(검색 조건 코드)
 */
export const getDistributeServerCode = () => {
    return instance.get(`/api/schedule-server/distribute-server-code`).catch((err) => {
        throw err;
    });
};

/**
 * 작업 목록 조회
 */
export const getJobList = ({ search }) => {
    return instance.get(`/api/schedule-server/job?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

/**
 * 작업 상세 조회
 */
export const getJob = (jobSeq) => {
    return instance.get(`/api/schedule-server/job/${jobSeq}`).catch((err) => {
        throw err;
    });
};

/**
 * 배포 서버 목록 조회
 */
export const getDistributeServerList = ({ search }) => {
    return instance.get(`/api/schedule-server/distribute-server?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
