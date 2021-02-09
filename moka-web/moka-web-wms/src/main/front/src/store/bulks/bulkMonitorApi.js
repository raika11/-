import qs from 'qs';
import instance from '@store/commons/axios';

// 벌크 모니터링 전체 건수 조회
export const getBulkStatTotal = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/bulkLogs/stat-total?${queryString}`).catch((err) => {
        throw err;
    });
};
