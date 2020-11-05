import qs from 'qs';
import instance from '@store/commons/axios';

// 데이타셋 목록 조회
export const getDatasetList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/datasets?${queryString}`).catch((err) => {
        throw err;
    });
};

// 데이타셋 조회
export const getDataset = ({ datasetSeq }) => {
    return instance.get(`/api/datasets/${datasetSeq}`).catch((err) => {
        throw err;
    });
};

// 데이타셋 저장
export const postDataset = ({ dataset }) => {
    console.log(dataset);
    const queryString = qs.stringify(dataset);
    return instance.post(`/api/datasets?${queryString}`).catch((err) => {
        throw err;
    });
};

// 데이타셋 수정
export const putDataset = ({ dataset }) => {
    return instance.put(`/api/datasets/${dataset.datasetSeq}`, qs.stringify(dataset)).catch((err) => {
        throw err;
    });
};

// 데이타셋 복사
export const copyDataset = ({ datasetSeq, datasetName }) => {
    const queryString = qs.stringify({ datasetName });
    return instance.post(`/api/datasets/${datasetSeq}/copy?${queryString}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 확인
export const hasRelationList = ({ datasetSeq }) => {
    return instance.get(`/api/datasets/${datasetSeq}/has-relations`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 조회
export const getRelationList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/datasets/${search.datasetSeq}/relations?${queryString}`).catch((err) => {
        throw err;
    });
};

// 데이타셋 삭제
export const deleteDataset = (datasetSeq) => {
    return instance.delete(`/api/datasets/${datasetSeq}`).catch((err) => {
        throw err;
    });
};

// API목록 조회
export const getApiList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/datasets/apis?${queryString}`).catch((err) => {
        throw err;
    });
};
