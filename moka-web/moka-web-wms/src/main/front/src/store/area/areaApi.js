import qs from 'qs';
import instance from '@store/commons/axios';

// 편집영역 목록 조회
export const getAreaList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/areas?${queryString}`).catch((err) => {
        throw err;
    });
};

// 편집영역 목록 정렬 application/json
export const putAreaListSrot = ({ parentAreaSeq, areaSeqList }) => {
    return instance
        .put(parentAreaSeq ? `/api/areas/sort/${parentAreaSeq}` : '/api/areas/sort/0', areaSeqList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
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
export const postArea = ({ area }) => {
    return instance
        .post('/api/areas', area, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 편집영역 수정(application/json)
export const putArea = ({ area }) => {
    return instance
        .put(`/api/areas/${area.areaSeq}`, area, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 편집영역 삭제
export const deleteArea = ({ areaSeq }) => {
    return instance.delete(`/api/areas/${areaSeq}`).catch((err) => {
        throw err;
    });
};

// 편집영역트리 조회 (페이지편집용)
export const getAreaTree = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/areas/tree?${queryString}`).catch((err) => {
        throw err;
    });
};
