import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 컴포넌트 워크 목록 조회
export const getComponentWorkList = ({ areaSeq }) => {
    return instance.get(`/api/desking/${areaSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크 1개 조회
export const getComponentWork = ({ componentWorkSeq }) => {
    return instance.get(`/api/desking/components/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크를 데스킹 테이블로 전송
export const postComponentWork = ({ componentWorkSeq }) => {
    return instance.post(`/api/desking/components/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크 수정(스냅샷 수정!)
export const putComponentWork = ({ componentWorkSeq, snapshotYn, snapshotBody, templateSeq }) => {
    const queryString = { snapshotYn, snapshotBody, templateSeq };
    return instance.get(`/api/desking/components/${componentWorkSeq}?${qs.stringify(queryString)}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크의 편집기사 1개 수정 => 폼데이터로 전송(multipart)
export const putDeskingWork = ({ componentWorkSeq, deskingWork }) => {
    return instance
        .put(`/api/desking/components/${componentWorkSeq}/contents`, objectToFormData(deskingWork), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 워크의 편집기사 여러개 추가 => payload
export const postDeskingWorkList = ({ componentWorkSeq, datasetSeq, deskingWorkList }) => {
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/list`, deskingWorkList, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 워크의 편집기사 이동 => payload
export const moveDeskingWorkList = ({ componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list }) => {
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/move?srcComponentWorkSeq=${srcComponentWorkSeq}&srcDatasetSeq=${srcDatasetSeq}`, list, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 워크의 편집기사 정렬 변경 => payload
export const putDeskingWorkPriority = ({ componentWork }) => {
    return instance
        .put(`/api/desking/components/${componentWork.seq}/contents/${componentWork.datasetSeq}/priority`, componentWork, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// work편집기사목록 임시저장
export const postPreComponentWork = ({ componentWorkSeq }) => {
    return instance.post(`/api/desking/pre/components/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};
