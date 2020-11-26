import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 컴포넌트 워크 목록 조회
export const getComponentWorkList = ({ areaSeq }) => {
    return instance.get(`/api/desking/${areaSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크를 데스킹 테이블로 전송
export const postComponentWork = ({ componentWorkSeq }) => {
    return instance.post(`/api/desking/components/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크 수정(스냅샷 제외)
export const putComponentWork = ({ componentWork }) => {
    return instance
        .put(`/api/desking/components/${componentWork.seq}`, componentWork, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 워크 스냅샷 수정
export const putSnapshotComponentWork = ({ componentWorkSeq, snapshotYn, snapshotBody }) => {
    const queryString = { snapshotYn, snapshotBody };
    return instance.put(`/api/desking/components/${componentWorkSeq}/snapshot?${qs.stringify(queryString)}`).catch((err) => {
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
export const postDeskingWorkList = ({ componentWorkSeq, datasetSeq, list }) => {
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/list`, list, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 공백 기사 추가=> payload
export const postDeskingWork = ({ componentWorkSeq, datasetSeq, deskingWork }) => {
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents${datasetSeq}`, objectToFormData(deskingWork), {
            headers: {
                'Content-Type': 'multipart/form-data',
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
// export const putDeskingWorkPriority = ({ componentWork }) => {
//     return instance
//         .put(`/api/desking/components/${componentWork.seq}/contents/${componentWork.datasetSeq}/priority`, componentWork, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//         .catch((err) => {
//             throw err;
//         });
// };

// 컴포넌트 워크 임시저장
export const postSaveComponentWork = ({ componentWorkSeq }) => {
    return instance.post(`/api/desking/components/save/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크 전송
export const postPublishComponentWork = ({ componentWorkSeq }) => {
    return instance.post(`/api/desking/components/publish/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크 예약
export const postReserveComponentWork = ({ componentWorkSeq, reserveDt }) => {
    const queryString = { reserveDt };
    return instance.post(`/api/desking/components/reserve/${componentWorkSeq}?${qs.stringify(queryString)}`).catch((err) => {
        throw err;
    });
};

// work편집기사 삭제 : payload
export const deleteDeskingWorkList = ({ componentWorkSeq, datasetSeq, list }) => {
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/delete`, list, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};
