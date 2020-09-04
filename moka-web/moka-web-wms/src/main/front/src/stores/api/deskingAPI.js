/* eslint-disable max-len */
import qs from 'qs';
import client from './client';
import { convertJsObjectToFormData } from '~/utils/convertUtil';
import { DESKING_SAVE_INTERVAL } from '~/constants';

// Work컴포넌트목록 조회(복수)
export const getComponentWorkList = (pageSeq) => {
    return client.get(`/api/desking/components?pageSeq=${pageSeq}`).catch((err) => {
        throw err;
    });
};

// Work컴포넌트 조회(단수)
export const getComponentWork = (componentWorkSeq) => {
    return client.get(`/api/desking/components/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// Work 편집기사 추가(폼데이터)
export const postDeskingWork = ({ componentWorkSeq, datasetSeq, deskingWork }) => {
    return client
        .post(
            `/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}`,
            convertJsObjectToFormData(deskingWork),
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// Work 편집기사 목록 추가 : payload
export const postDeskingWorkList = ({ componentWorkSeq, datasetSeq, list }) => {
    return client
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/list`, list, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// Work 편집기사 목록 이동 : payload
export const moveDeskingWorkList = ({
    componentWorkSeq,
    datasetSeq,
    srcComponentWorkSeq,
    srcDatasetSeq,
    list
}) => {
    return client
        .post(
            `/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/move?srcComponentWorkSeq=${srcComponentWorkSeq}&srcDatasetSeq=${srcDatasetSeq}`,
            list,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// 데스킹워크 수정(폼데이터)
export const putDeskingWork = ({ componentWorkSeq, deskingWork }) => {
    return client
        .put(
            `/api/desking/components/${componentWorkSeq}/contents`,
            convertJsObjectToFormData(deskingWork),
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// 데스킹워크의 관련기사 수정(RequestBody => 데이터타입 json)
export const putDeskingRelWorks = ({ componentWorkSeq, deskingWork, deskingRelWorks }) => {
    return client
        .put(
            `/api/desking/components/${componentWorkSeq}/contents/${deskingWork.datasetSeq}/${deskingWork.contentsId}/relations`,
            deskingRelWorks,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// 데스킹워크의 관련기사 삭제
export const deleteDeskingRelWork = ({ componentWorkSeq, deskingWork, deskingRelWork }) => {
    return client
        .delete(
            `/api/desking/components/${componentWorkSeq}/contents/${deskingWork.datasetSeq}/${
                deskingWork.contentsId
            }/relations?${qs.stringify(deskingRelWork)}`
        )
        .catch((err) => {
            throw err;
        });
};

// Work컴포넌트 순번수정 :  : Payload Request
export const putDeskingWorkPriority = ({ component }) => {
    return client
        .put(
            `/api/desking/components/${component.seq}/contents/${component.datasetSeq}/priority`,
            component,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .catch((err) => {
            throw err;
        });
};

// Work컴포넌트 전송
export const postComponentWork = (componentWorkSeq) => {
    return client.post(`/api/desking/components/${componentWorkSeq}`).catch((err) => {
        throw err;
    });
};

// 다른사람이 저장했는지 조사
export const hasOtherSaved = ({ componentWorkSeq, datasetSeq }) => {
    return client
        .get(
            // eslint-disable-next-line max-len
            `/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/hasOtherSaved?interval=${DESKING_SAVE_INTERVAL}`
        )
        .catch((err) => {
            throw err;
        });
};

// Work 편집기사 삭제 : payload
export const deleteDeskingWorkList = ({ componentWorkSeq, datasetSeq, list }) => {
    return client
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/delete`, list, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch((err) => {
            throw err;
        });
};

// Work컴포넌트 수정
export const putComponentWork = ({ componentWorkSeq, snapshotYn, snapshotBody, templateSeq }) => {
    const params = {
        snapshotYn,
        snapshotBody,
        templateSeq
    };
    return client
        .put(`/api/desking/components/${componentWorkSeq}`, qs.stringify(params))
        .catch((err) => {
            throw err;
        });
};

// 컴포넌트의 데스킹 히스토리(그룹, 상세) 조회
export const getDeskingHistories = ({ search, componentWorkSeq }) => {
    return client
        .get(
            `/api/desking/components/${componentWorkSeq}/contents/${
                search.datasetSeq
            }/histories?${qs.stringify(search)}`
        )
        .catch((err) => {
            throw err;
        });
};

// 페이지내 모든 컴포넌트 데스킹 히스토리 조회
export const getAllDeskingHistoriesGroup = ({ pageSeq }) => {
    return client.get(`/api/desking/histories?pageSeq=${pageSeq}`).catch((err) => {
        throw err;
    });
};

// 히스토리 불러오기
export const postDeskingHistories = ({ search, componentWorkSeq }) => {
    return client
        .post(
            `/api/desking/components/${componentWorkSeq}/contents/${
                search.datasetSeq
            }/histories?${qs.stringify(search)}`
        )
        .catch((err) => {
            throw err;
        });
};

// 페이지내 모든 컴포넌트 데스킹 히스토리 중 특정 데이터셋의 기사목록(상세) 조회
export const getAllDeskingHistories = ({ search }) => {
    return client
        .get(`/api/desking/histories/${search.datasetSeq}?${qs.stringify(search)}`)
        .catch((err) => {
            throw err;
        });
};
