import qs from 'qs';
import instance from '@store/commons/axios';

// 벌크 모니터링 전체 건수 조회
export const getBulkStatTotal = ({ date }) => {
    const queryString = qs.stringify(date);
    return instance.get(`/api/bulkLogs/stat-total?${queryString}`).catch((err) => {
        throw err;
    });
};

// 벌크 모니터링 전송 목록 조회
export const getBulkStatList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/bulkLogs/stat-list?${queryString}`).catch((err) => {
        throw err;
    });
};

// 벌크 전송 상세 정보 조회
export const getBulkStatListInfo = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/bulkLogs/stat-list-info?${queryString}`).catch((err) => {
        throw err;
    });
};
