import qs from 'qs';
import client from './client';

// 데이타셋목록 조회
export const getDatasetList = ({ search }) => {
    return client.get(`/api/datasets?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 데이타셋 상세 조회
export const getDataset = (datasetSeq) => {
    return client.get(`/api/datasets/${datasetSeq}`).catch((err) => {
        throw err;
    });
};

// 데이타셋 저장
export const postDataset = ({ dataset }) => {
    return client.post('/api/datasets', qs.stringify(dataset)).catch((err) => {
        throw err;
    });
};

// 데이타셋 수정
export const putDataset = ({ dataset }) => {
    return client.put(`/api/datasets/${dataset.datasetSeq}`, qs.stringify(dataset)).catch((err) => {
        throw err;
    });
};

// 데이타셋 삭제
export const deleteDataset = (datasetSeq) => {
    return client.delete(`/api/datasets/${datasetSeq}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 조회
export const getRelationList = ({ search }) => {
    return client
        .get(`/api/datasets/${search.relSeq}/relations?${qs.stringify(search)}`)
        .catch((err) => {
            throw err;
        });
};

// API목록 조회
export const getApiList = ({ search }) => {
    return client.get(`/api/datasets/apis?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 관련 아이템 확인
export const hasRelations = (datasetSeq) => {
    return client.get(`/api/datasets/${datasetSeq}/hasRelations`).catch((err) => {
        throw err;
    });
};

// 데이타셋 저장
export const copyDataset = ({ datasetSeq, datasetName }) => {
    return client
        .post(`/api/datasets/${datasetSeq}/copy`, qs.stringify({ datasetName }))
        .catch((err) => {
            throw err;
        });
};
