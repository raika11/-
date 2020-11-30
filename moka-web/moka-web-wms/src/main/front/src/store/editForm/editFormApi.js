import qs from 'qs';
import instance from '../commons/axios';
import common from '@utils/commonUtil';
import { objectToFormData } from '@/utils/convertUtil';

// Edit Form목록 조회
export const getEditFormList = ({ search }) => {
    return instance.get(`/api/edit-forms`).catch((err) => {
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
    return instance.post(`/api/edit-forms/${formSeq}/parts/${partSeq}`, qs.stringify(partJson)).catch((err) => {
        throw err;
    });
};

// Edit Form 수정
export const putEditForm = ({ formSeq, partSeq, partJson }) => {
    return instance.put(`/api/edit-forms/${formSeq}/parts/${partSeq}`, qs.stringify(partJson)).catch((err) => {
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
    return instance.get(`/api/edit-forms/${editFormPart.formSeq}/parts/${editFormPart.partSeq}/historys`).catch((err) => {
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
        .get(`/api/edit-forms/${part.formSeq}/parts/${part.partSeq}/export`, {
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
        .get(`/api/edit-forms/${history.formSeq}/parts/${history.partSeq}/historys/${history.seqNo}/export`, {
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
    formData.append('file', xmlFile);
    if (importForm && importForm.formSeq) {
        formData.append('formSeq', importForm.formSeq);
    }
    if (importForm && importForm.partSeq) {
        formData.append('partSeq', importForm.partSeq);
    }
    return instance
        .post(`/api/edit-forms/import-xml`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
