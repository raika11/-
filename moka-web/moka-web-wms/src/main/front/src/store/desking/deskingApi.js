// import qs from 'qs';
import instance from '@store/commons/axios';

// Work컴포넌트목록 조회(복수)
export const getComponentWorkList = ({ areaSeq }) => {
    return instance.get(`/api/desking/${areaSeq}`).catch((err) => {
        throw err;
    });
};

// work편집기사목록 추가 (파일업로드 안됨)
export const postDeskingWorkList = ({ componentWorkSeq, datasetSeq, deskingWork }) => {
    return instance
        .post(`/api/desking/components/${componentWorkSeq}/contents/${datasetSeq}/list`, deskingWork, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .catch((err) => {
            throw err;
        });
};
