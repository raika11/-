import qs from 'qs';
import instance from '../commons/axios';
import commonUtil from '@utils/commonUtil';

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

// 키워드 엑셀 다운로드
export const getSearchKeywordExcel = ({ search }) => {
    return instance
        .get(`/api/search-keywords/excel?${qs.stringify(search)}`, {
            // headers: {
            //     Accept: 'application/vnd.ms-excel',
            // },
            headers: {
                'Content-Type': 'application/vnd.ms-excel',
            },
        })
        .then((response) => {
            debugger;
            let filename = response.headers['x-suggested-filename'];
            commonUtil.fileDownload(response.data, filename, 'application/vnd.ms-excel');
        })
        .catch((err) => {
            throw err;
        });
};
