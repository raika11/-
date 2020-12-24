import instance from '../commons/axios';

export const insertBoard = ({ file }) => {
    var formData = new FormData();
    formData.append('attaches[0].attachFile', file);
    formData.append('attaches[0].seqNo', 0);
    formData.append('attaches[1].seqNo', 11);

    formData.append('content', '내용');
    formData.append('title', '타이틀');
    formData.append('pwd', '1111');

    return instance
        .post(`/api/boards/2/contents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
