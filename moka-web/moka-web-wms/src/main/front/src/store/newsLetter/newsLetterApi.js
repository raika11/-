import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 뉴스레터 상품 목록 조회
export const getNewsLetterList = ({ search }) => {
    return instance.get(`/api/newsletter?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 뉴스레터 상품 등록
export const postNewsLetter = ({ newsLetter }) => {
    return instance
        .post(`/api/newsletter`, objectToFormData(newsLetter), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 뉴스레터 상품 상세 조회
export const getNewsLetter = (letterSeq) => {
    return instance.get(`/api/newsletter/${letterSeq}`).catch((err) => {
        throw err;
    });
};
