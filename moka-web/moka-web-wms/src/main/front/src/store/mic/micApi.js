import qs from 'qs';
import instance from '@store/commons/axios';

// 아젠다 목록 조회
export const getMicAgendaList = ({ search }) => {
    return instance.get(`/api/mics/agendas?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 레포트 (아젠다, 전체 포스트 수)
export const getMicReport = () => {
    return instance.get('/api/mics/report').catch((err) => {
        throw err;
    });
};

// 아젠다 순서 변경(application/json)
export const putMicAgendaSort = ({ sortedList }) => {
    return instance
        .put('/api/mics/agendas/sort', sortedList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 카테고리 목록 조회
export const getMicCategoryList = ({ search }) => {
    return instance.get(`/api/mics/categorys?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 카테고리 수정(application/json)
export const putMicCategory = ({ categoryList }) => {
    return instance
        .put('/api/mics/categorys', categoryList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 카테고리 등록
export const postMicCategory = ({ category }) => {
    return instance.post('/api/mics/categorys', qs.stringify(category)).catch((err) => {
        throw err;
    });
};

// 배너 목록 조회
export const getMicBannerList = ({ search }) => {
    return instance.get(`/api/mics/banners?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 배너 목록 상세 조회
export const getMicBanner = ({ bnnrSeq }) => {
    return instance.get(`/api/mics/banners/${bnnrSeq}`).catch((err) => {
        throw err;
    });
};

// 배너 목록 등록
export const postMicBanner = ({ banner }) => {
    return instance.post(`/api/mics/banners`, qs.stringify(banner)).catch((err) => {
        throw err;
    });
};

// 배너 목록 수정
export const putMicBanner = ({ banner }) => {
    return instance.put(`/api/mics/banners/${banner.bnnrSeq}`, qs.stringify(banner)).catch((err) => {
        throw err;
    });
};
