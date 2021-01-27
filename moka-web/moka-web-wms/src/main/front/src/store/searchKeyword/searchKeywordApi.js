import qs from 'qs';
import instance from '../commons/axios';

// 키워드 통계 조회
export const getSearchKeywordStat = ({ search }) => {
    return instance.get(`/api/search-keywords/stat?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 키워드 통계 상세 조회
export const getSearchKeywordStatDetail = ({ search }) => {
    return instance.get(`/api/search-keywords/stat-detail?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 투표 엑셀 다운로드
export const getSearchKeywordExcel = ({ search }) => {
    return instance.get(`/api/search-keywords/excel?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};
