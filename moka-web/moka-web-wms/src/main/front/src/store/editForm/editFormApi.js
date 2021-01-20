import qs from 'qs';
import instance from '../commons/axios';
import common from '@utils/commonUtil';
// import { objectToFormData } from '@/utils/convertUtil';

// Edit Form목록 조회
export const getEditFormList = ({ search }) => {
    return instance.get(`/api/edit-forms`).catch((err) => {
        throw err;
    });
};

// part 목록 조회
export const getEditFormPartList = ({ search }) => {
    return instance.get(`/api/edit-forms/parts?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// Edit Form정보 조회
export const getEditForm = (formSeq) => {
    return instance.get(`/api/edit-forms/${formSeq}`).catch((err) => {
        throw err;
    });
};

// Form ID 중복 체크
export const duplicateCheck = (formId) => {
    return instance.get(`/api/edit-forms/${formId}/exists`).catch((err) => {
        throw err;
    });
};

// Edit Form 저장
export const postEditForm = ({ formSeq, partSeq, partJson }) => {
    return instance.post(`/api/edit-forms/parts/${partSeq}`, qs.stringify(partJson)).catch((err) => {
        throw err;
    });
};

// Edit Form 수정
export const putEditForm = ({ formSeq, partSeq, partJson }) => {
    return instance.put(`/api/edit-forms/parts/${partSeq}`, qs.stringify(partJson)).catch((err) => {
        throw err;
    });
};

// Edit Form 삭제
export const deleteEditForm = ({ formSeq }) => {
    return instance.delete(`/api/edit-forms/${formSeq}`).catch((err) => {
        throw err;
    });
};

// Edit Form목록 조회
export const getEditFormHistoryList = ({ editFormPart, search }) => {
    return instance.get(`/api/edit-forms/parts/${editFormPart.partSeq}/historys`).catch((err) => {
        throw err;
    });
};

// Edit Form xml 다운로드
export const exportEditFormXml = (formSeq) => {
    instance
        .get(`/api/edit-forms/${formSeq}/export`, {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'text/xml',
            },
        })
        .then((response) => {
            let filename = response.headers['x-suggested-filename'];

            common.fileDownload(response.data, filename, 'text/xml');
        })
        .catch((err) => {
            throw err;
        });
};

// Edit Form part xml 다운로드
export const exportEditFormPartXml = (part) => {
    instance
        .get(`/api/edit-forms/parts/${part.partSeq}/export`, {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'text/xml',
            },
        })
        .then((response) => {
            let filename = decodeURI(response.headers['x-suggested-filename']);

            common.fileDownload(response.data, filename, 'text/xml');
        })
        .catch((err) => {
            throw err;
        });
};

// Edit Form part 이력 xml 다운로드
export const exportEditFormPartHistoryXml = (history) => {
    instance
        .get(`/api/edit-forms/parts/${history.partSeq}/historys/${history.seqNo}/export`, {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'text/xml',
            },
        })
        .then((response) => {
            let filename = decodeURI(response.headers['x-suggested-filename']);

            common.fileDownload(response.data, filename, 'text/xml');
        })
        .catch((err) => {
            throw err;
        });
};

// Edit Form 저장
export const importEditFormXmlFile = ({ xmlFile, importForm }) => {
    var formData = new FormData();
    formData.append('pollItems[0].title', '항목1');
    formData.append('pollItems[0].imgFile', xmlFile);
    formData.append('pollItems[1].title', '항목2');
    formData.append('pollItems[1].imgFile', xmlFile);

    formData.append('pollGroup', 'P');
    formData.append('pollCategory', 'AA');
    formData.append('pollDiv', 'W');
    formData.append('pollType', 'P');
    formData.append('allowAnswCnt', 3);
    formData.append('voteCnt', 2);
    formData.append('startDt', '2021-01-20 00:00:00');
    formData.append('endDt', '2021-02-20 00:00:00');
    formData.append('title', '투표 테스트');

    return instance
        .post(`/api/polls`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
