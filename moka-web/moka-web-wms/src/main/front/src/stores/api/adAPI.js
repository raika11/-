import qs from 'qs';
import client from './client';

// 목록 조회
export const getAds = ({ search }) => {
    return client.get(`/api/ads?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 정보 조회
export const getAd = (adSeq) => {
    return client.get(`/api/ads/${adSeq}`).catch((err) => {
        throw err;
    });
};

// 저장
export const postAd = ({ ad }) => {
    const adSet = {
        ...ad,
        'domain.domainId': ad.domain.domainId
    };
    return client.post('/api/ads', qs.stringify(adSet)).catch((err) => {
        throw err;
    });
};

// 수정
export const putAd = ({ ad }) => {
    const adSet = {
        ...ad,
        'domain.domainId': ad.domain.domainId
    };
    delete adSet.domain;
    return client.put(`/api/ads/${adSet.containerSeq}`, qs.stringify(adSet)).catch((err) => {
        throw err;
    });
};

// 삭제
export const deleteAd = (adSeq) => {
    return client.delete(`/api/ads/${adSeq}`).catch((err) => {
        throw err;
    });
};
