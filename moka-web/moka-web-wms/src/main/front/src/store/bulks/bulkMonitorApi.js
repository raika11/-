import qs from 'qs';
import instance from '@store/commons/axios';

// 벌크 모니터링 전체 건수 조회
export const getBulkStatTotal = ({ date }) => {
    return instance.get(`/api/bulkLogs/stat-total?${qs.stringify(date)}`).catch((err) => {
        throw err;
    });
};

// 벌크 모니터링 전송 목록 조회
export const getBulkStatList = ({ search }) => {
    return instance.get(`/api/bulkLogs/stat-list?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 벌크 전송 상세 정보 조회
export const getBulkStatListInfo = ({ contentId, portalDiv }) => {
    return instance.get(`/api/bulkLogs/stat-list-info?${qs.stringify({ contentId, portalDiv })}`).catch((err) => {
        throw err;
    });
};
