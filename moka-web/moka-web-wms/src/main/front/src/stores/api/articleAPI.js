import qs from 'qs';
import moment from 'moment';
import { DB_DATE_FORMAT } from '~/constants';
import client from './client';

// 목록 조회
export const getArticles = ({ search }) => {
    const searchDTO = {
        ...search,
        distEndYmdt: moment(search.distEndYmdt, DB_DATE_FORMAT).add(1, 'day').format(DB_DATE_FORMAT)
    };
    return client.get(`/api/contents/articles?${qs.stringify(searchDTO)}`).catch((err) => {
        throw err;
    });
};

// 기사 조회
export const getArticle = (contentsId) => {
    return client.get(`/api/contents/articles/${contentsId}`).catch((err) => {
        throw err;
    });
};
