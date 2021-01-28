import qs from 'qs';
import instance from '../commons/axios';

// 키워드 통계 조회
export const getSearchKeywordStat = ({ search }) => {
    return instance.get(`/api/search-keywords/stat?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 키워드 전체 건수 조회
export const getSearchKeywordStatTotal = ({ search }) => {
    return instance.get(`/api/search-keywords/stat-total?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 키워드 통계 상세 조회
export const getSearchKeywordStatDetail = ({ search }) => {
    return instance.get(`/api/search-keywords/stat-detail?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
