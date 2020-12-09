import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 컴포넌트 워크 목록 조회
export const getComponentWorkList = ({ areaSeq }) => {
    return instance.get(`/api/desking/${areaSeq}`).catch((err) => {
        throw err;
    });
};

// 컴포넌트 워크 조회
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
export const putDeskingWork = ({ areaSeq, componentWorkSeq, deskingWork }) => {
    const queryString = { areaSeq };
    return instance
        .put(`/api/desking/components/${componentWorkSeq}/contents?${qs.stringify(queryString)}`, objectToFormData(deskingWork), {
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

// 더미 기사 추가=> payload
export const postDeskingWork = ({ areaSeq, componentWorkSeq, datasetSeq, deskingWork }) => {
    const queryString = { areaSeq };
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}?${qs.stringify(queryString)}`, objectToFormData(deskingWork), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트 워크의 편집기사 이동 => payload
export const postDeskingWorkListMove = ({ componentWorkSeq, datasetSeq, srcComponentWorkSeq, srcDatasetSeq, list }) => {
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

// 컴포넌트 워크의 기사목록 정렬(컴포넌트 내 정렬) => payload
export const putDeskingWorkListSort = ({ componentWorkSeq, datasetSeq, list }) => {
    return instance
        .put(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/sort`, list, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};

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

// 컴포넌트 워크 예약 삭제
export const deleteReserveComponentWork = ({ componentWorkSeq }) => {
    return instance.delete(`/api/desking/components/reserve/${componentWorkSeq}`).catch((err) => {
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

// 히스토리 조회(컴포넌트별)
export const getComponentHistoryList = ({ search }) => {
    const queryString = qs.stringify(search);
    return instance.get(`/api/desking/components/histories/${search.componentSeq}?${queryString}`).catch((err) => {
        throw err;
    });
};

// 히스토리 상세조회(페이징 없음)
export const getDeskingHistory = ({ componentHistSeq }) => {
    return instance.get(`/api/desking/histories/${componentHistSeq}`).catch((err) => {
        throw err;
    });
};

// 히스토리를 편집기사 워크로 등록
export const putDeskingWorkHistory = ({ componentWorkSeq, componentHistSeq }) => {
    return instance.put(`/api/desking/components/${componentWorkSeq}/history/${componentHistSeq}`).catch((err) => {
        throw err;
    });
};
