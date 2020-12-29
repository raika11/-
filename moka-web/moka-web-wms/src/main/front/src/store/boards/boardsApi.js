import qs from 'qs';
import instance from '@store/commons/axios';
import { objectToFormData } from '@utils/convertUtil';

// 게시판 채널 리스트 가지고 오기.
export const getBoardChannelList = () => {
    return instance.get(`/api/codemgt-grps/BOARD_DIVC/codemgts?grpCd=BOARD_DIVC`).catch((err) => {
        throw err;
    });
};

// 게시판 리스트 가지고 오기.
export const getBoardInfoList = ({ search }) => {
    return instance.get(`/api/board-info?${qs.stringify(search)}`).catch((err) => {
        throw err;
    });
};

// 게시판 상세 조회.
export const getBoardInfo = ({ boardId }) => {
    return instance.get(`/api/board-info/${boardId}`).catch((err) => {
        throw err;
    });
};

// 게시판 등록.
export const saveBoardInfo = ({ PostData: { boardinfo } }) => {
    return instance.post(`/api/board-info`, objectToFormData(boardinfo)).catch((err) => {
        throw err;
    });
};

// 게시판 삭제.
export const deleteBoard = ({ boardId }) => {
    return instance.delete(`/api/board-info/${boardId}`).catch((err) => {
        throw err;
    });
};

// 게시판 그룹 리스트.
export const getBoardGroup = () => {
    return instance.get(`/api/board-info/groups`).catch((err) => {
        throw err;
    });
};
