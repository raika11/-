import qs from 'qs';
import instance from '@store/commons/axios';

// 편집영역 목록 조회
export const getAreaList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/areas?${queryString}`).catch((err) => {
        throw err;
    });
};

// 편집영역 조회
export const getArea = ({ areaSeq }) => {
    return instance.get(`/api/areas/${areaSeq}`).catch((err) => {
        throw err;
    });
};

// 편집영역 저장(application/json)
export const postArea = ({ Area }) => {
    return instance
        .post('/api/areas', Area, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 편집영역 수정(application/json)
export const putArea = ({ Area }) => {
    return instance
        .put(`/api/areas/${Area.areaSeq}`, Area, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};
