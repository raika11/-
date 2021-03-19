// import instance from '../commons/axios';
import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

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

const makeBoardContentsFormData = ({ files, contentsData }) => {
    delete contentsData.attaches;
    delete contentsData.regName;
    delete contentsData.boardInfo;

    var formData = new FormData();

    files.map((element, index) => {
        if (element.seqNo > 0) {
            formData.append(`attaches[${index}].seqNo`, element.seqNo);
        } else {
            formData.append(`attaches[${index}].attachFile`, element);
            formData.append(`attaches[${index}].seqNo`, 0);
        }

        return true;
    });

    Object.keys(contentsData).forEach((key) => {
        let value = contentsData[key];

        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }

        // formData.append(key, value);
    });

    return formData;
};

/**
 * 게시판 채널 리스트
 */
export const getBoardChannelList = () => {
    return instance.get(`/api/codemgt-grps/BOARD_DIVC/codemgts?grpCd=BOARD_DIVC`).catch((err) => {
        throw err;
    });
};

/**
 * 게시판 리스트
 */
export const getBoardInfoList = ({ search }) => {
    return instance.get(`/api/board-info?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

/**
 * 게시판 상세 조회
 */
export const getBoardInfo = (boardId) => {
    return instance.get(`/api/board-info/${boardId}`).catch((err) => {
        throw err;
    });
};

/**
 * 게시판 등록
 */
export const saveBoardInfo = ({ boardInfo }) => {
    return instance.post(`/api/board-info`, objectToFormData(boardInfo)).catch((err) => {
        throw err;
    });
};

/**
 * 게시판 삭제
 */
export const deleteBoard = ({ boardId }) => {
    return instance.delete(`/api/board-info/${boardId}`).catch((err) => {
        throw err;
    });
};

/**
 * 게시글 게시판 그룹 목록
 */
export const getBoardGroup = () => {
    return instance.get(`/api/board-info/groups`).catch((err) => {
        throw err;
    });
};

/**
 * 게시글 게시판 리스트
 */
export const getBoardContentsList = ({ boardId, search }) => {
    return instance.get(`/api/boards/${boardId}/contents?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

/**
 * 게시글 게시판 상세 조회
 */
export const getBoardContentsInfo = ({ boardId, boardSeq }) => {
    return instance.get(`/api/boards/${boardId}/contents/${boardSeq}`).catch((err) => {
        throw err;
    });
};

// 보드 채널 목록 가지고 오기 (JPOD)
export const getBoardJpodChannalList = () => {
    return instance.get(`/api/jpods?usedYn=Y`).catch((err) => {
        throw err;
    });
};

// 보드 채널 목록 가지고 오기 (기자)
export const getBoardReportersChannalList = () => {
    return instance.get(`/api/reporters?page=0&searchType=all&sort=repSeq%2Casc&keyword=`).catch((err) => {
        throw err;
    });
};

/**
 * 게시판 게시글 등록
 */
export const saveBoardContents = ({ PostData: { boardId, formData } }) => {
    return instance
        .post(`/api/boards/${boardId}/contents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

/**
 * 게시판 게시글 수정
 */
export const updateBoardContents = ({ boardId, boardSeq, formData }) => {
    return instance
        .put(`/api/boards/${boardId}/contents/${boardSeq}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

/**
 * 게시판 게시글 답변 저장
 */
export const saveBoardReply = ({ boardId, parentBoardSeq, contents, files }) => {
    return instance
        .post(`/api/boards/${boardId}/contents/${parentBoardSeq}/reply`, makeBoardContentsFormData({ files: files, contentsData: contents }), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

/**
 * 게시판 게시글 답변 수정
 */
export const updateBoardReply = ({ boardId, parentBoardSeq, boardSeq, contents, files }) => {
    return instance
        .put(`/api/boards/${boardId}/contents/${parentBoardSeq}/replys/${boardSeq}`, makeBoardContentsFormData({ files: files, contentsData: contents }), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};

/**
 * 게시판 게시글 삭제
 */
export const deleteBoardContents = ({ boardId, boardSeq }) => {
    return instance.delete(`/api/boards/${boardId}/contents/${boardSeq}`).catch((err) => {
        throw err;
    });
};

/**
 * 게시판 본문 이미지 저장
 */
export const uploadBoardContentImage = ({ boardId, imageForm }) => {
    return instance
        .post(`/api/boards/${boardId}/image`, imageForm, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => {
            throw err;
        });
};
