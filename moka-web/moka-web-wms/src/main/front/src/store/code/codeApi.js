import qs from 'qs';
import instance from '@store/commons/axios';

// 분류 목록 조회(마스터코드)
export const getMastercodeList = ({ search }) => {
    // searchType: parentCode(부모코드값), korname(코드명)
    // 코드는 2/2/3구조임
    const queryString = qs.stringify(search);
    return instance.get(`/api/codes/masters?${queryString}`).catch((err) => {
        throw err;
    });
};
