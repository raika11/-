import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import {
    initialState,
    GET_LIST_MENU_CONTENTS_INFO,
    getListMenuContentsInfo,
    clearListMenuContentsInfo,
    saveBoardContents,
    updateBoardContents,
    getListMenuContentsList,
    saveBoardReply,
    deleteBoardContents,
} from '@store/board';

import BoardsEditForm from './BoardsEditForm';
import BoardsEditReplyForm from './BoardsEditReplyForm';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 편집
 */
const BoardsEdit = ({ match }) => {
    const history = useHistory();
    const { boardId, boardSeq, parentBoardSeq, reply } = useParams();
    const dispatch = useDispatch();

    const storeBoardType = useSelector((store) => store.board.boardType);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);
    const loading = useSelector((store) => store.loading[GET_LIST_MENU_CONTENTS_INFO]);

    const [title, setTitle] = useState('');
    const [editData, setEditData] = useState(initialState.listMenu.contents.info); // 게시글 정보가 저장되는 state
    const [editReplyData, setEditReplyData] = useState(initialState.listMenu.contents.reply); // 답변 정보가 저장되는 state

    /**
     * 게시글 폼 입력값 변경
     */
    const handleChangeEditData = useCallback(
        (formData) => {
            setEditData({ ...editData, ...formData });
            // const { name, value, checked, type } = e.target;
        },
        [editData],
    );

    /**
     * 답변 폼 입력값 변경
     */
    const handleChangeReplyData = useCallback(
        (formData) => {
            setEditReplyData({ ...editReplyData, ...formData });
            // const { name, value } = e.target;
        },
        [editReplyData],
    );

    /**
     * 서비스 게시글 폼 데이터
     */
    const makeServiceFormData = () => {
        const formData = new FormData();
        formData.append('depth', 0);
        formData.append('indent', 0);
        formData.append('channelId', editData.channelId);
        formData.append('content', editData.content);
        formData.append('ordNo', editData.ordNo);
        formData.append('title', editData.title);
        formData.append('pushReceiveYn', editData.pushReceiveYn);
        formData.append('emailReceiveYn', editData.emailReceiveYn);
        formData.append('email', editData.email || '');

        formData.append('titlePrefix1', editData.titlePrefix1);
        formData.append('titlePrefix2', editData.titlePrefix2);

        editData.attaches.forEach((element, index) => {
            if (element.seqNo > 0) {
                formData.append(`attaches[${index}].seqNo`, element.seqNo);
            } else {
                formData.append(`attaches[${index}].attachFile`, element);
                formData.append(`attaches[${index}].seqNo`, 0);
            }
        });

        return formData;
    };

    const makeAdminFormData = () => {};

    /**
     * 게시글 저장
     */
    const handleClickContentsSave = () => {
        let formData; // 폼데이터
        if (storeBoardType === 'S') {
            formData = makeServiceFormData();
        } else {
            formData = makeAdminFormData();
        }
        dispatch(
            saveBoardContents({
                boardId: boardId,
                formData: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        dispatch(getListMenuContentsList(boardId));
                        toast.success(message);
                        history.push(`${match.path}/${boardId}/${body.boardSeq}`);
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    /**
     * 게시글 수정
     */
    const handleClickUpdate = () => {
        let formData = {}; // 폼데이터
        if (storeBoardType === 'S') {
            formData = makeServiceFormData();
        } else {
            formData = makeAdminFormData();
        }
        dispatch(
            updateBoardContents({
                boardId: boardId,
                boardSeq: boardSeq,
                formData: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { boardSeq } = body;
                        history.push(`${match.path}/${boardId}/${boardSeq}`);
                        dispatch(getListMenuContentsList(boardId));
                        dispatch(getListMenuContentsInfo({ boardId: boardId, boardSeq: boardSeq }));
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    /**
     * 게시글 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm('게시글을 삭제 하시겠습니까?', () => {
            dispatch(
                deleteBoardContents({
                    boardId: boardId,
                    boardSeq: boardSeq,
                    callback: ({ header: { success, message }, body }) => {
                        if (success === true) {
                            toast.success(message);
                            history.push(`${match.path}/${boardId}`);
                            dispatch(getListMenuContentsList(boardId));
                        } else {
                            const { totalCnt, list } = body;
                            if (totalCnt > 0 && Array.isArray(list)) {
                                // 에러 메시지 확인.
                                messageBox.alert(list[0].reason, () => {});
                            } else {
                                // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                                messageBox.alert(message, () => {});
                            }
                        }
                    },
                }),
            );
        });
    };

    /**
     * 게시글 취소 버튼
     */
    const handleClickCancle = () => {
        history.push(`${match.path}/${boardId}`);
    };

    /**
     * 답변 등록 버튼
     */
    const handleClickReplay = () => {
        history.push(`${match.path}/${boardId}/${boardSeq}/reply`);
    };

    /**
     * 답변 저장 버튼
     */
    const handleClickReplaySave = () => {
        dispatch(
            saveBoardReply({
                boardId: boardId,
                parentBoardSeq: parentBoardSeq,
                boardSeq: boardSeq,
                contents: {
                    boardId: null,
                    title: editReplyData.title,
                    content: editReplyData.content,
                    depth: editData.depth + 1,
                    indent: editData.indent + 1,
                    ordNo: editData.ordNo,
                    channelId: parentBoardSeq && reply ? contentsReply.channelId : editData.channelId,
                    titlePrefix1: parentBoardSeq && reply ? contentsReply.titlePrefix1 : editData.titlePrefix1,
                    titlePrefix2: parentBoardSeq && reply ? contentsReply.titlePrefix2 : editData.titlePrefix2,
                    // addr: editData.addr,
                },
                files: { attachFile: [] },
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`${match.path}/${boardId}/${body.parentBoardSeq}`);
                        dispatch(getListMenuContentsList(boardId));
                        dispatch(getListMenuContentsInfo({ boardId: boardId, boardSeq: boardSeq }));
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    /**
     * 답변 삭제 버튼
     */
    const handleClickReplayDelete = () => {};

    useEffect(() => {
        if (boardId && boardSeq) {
            dispatch(getListMenuContentsInfo({ boardId: boardId, boardSeq: boardSeq }));
        } else {
            dispatch(clearListMenuContentsInfo());
            setTitle('');
        }
    }, [boardId, boardSeq, dispatch]);

    useEffect(() => {
        if (boardSeq) {
            if (parentBoardSeq && reply) {
                setTitle('답변 수정');
            } else if (!parentBoardSeq && reply) {
                setTitle('답변 등록');
            } else {
                setTitle('게시글 수정');
            }
        } else {
            setTitle('게시글 등록');
        }
    }, [boardSeq, parentBoardSeq, reply]);

    useEffect(() => {
        // store 게시글 상세 정보를 local state로 셋팅
        setEditData(contentsInfo);
    }, [contentsInfo]);

    useEffect(() => {
        // store 답글 상세 정보를 local state로 셋팅
        setEditReplyData(contentsReply);
    }, [contentsReply]);

    return (
        <MokaCard
            className="w-100"
            title={title}
            loading={loading}
            bodyClassName="d-flex flex-column"
            footerClassName="d-flex justify-content-center"
            footer
            footerAs={
                <>
                    {!boardSeq && (
                        // 게시글 등록
                        <>
                            <Button variant="positive" className="mr-1" onClick={handleClickContentsSave}>
                                저장
                            </Button>
                            <Button variant="negative" onClick={handleClickCancle}>
                                취소
                            </Button>
                        </>
                    )}
                    {boardSeq && !parentBoardSeq && !reply && (
                        // 게시글 조회
                        <>
                            {selectBoard.answYn === 'Y' && (
                                <Button variant="negative" className="mr-1" onClick={handleClickReplay}>
                                    답변
                                </Button>
                            )}
                            <Button variant="positive" className="mr-1" onClick={handleClickUpdate}>
                                수정
                            </Button>
                            <Button variant="negative" className="mr-1" onClick={handleClickDelete}>
                                삭제
                            </Button>
                            <Button variant="negative" onClick={handleClickCancle}>
                                취소
                            </Button>
                        </>
                    )}
                    {boardSeq &&
                        reply &&
                        (parentBoardSeq ? (
                            // 답변 조회
                            <>
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    수정
                                </Button>
                                <Button variant="negative" className="mr-1" onClick={handleClickReplayDelete}>
                                    삭제
                                </Button>
                                <Button variant="negative" onClick={handleClickCancle}>
                                    취소
                                </Button>
                            </>
                        ) : (
                            // 답변 등록
                            <>
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    저장
                                </Button>
                                <Button variant="negative" onClick={handleClickCancle}>
                                    취소
                                </Button>
                            </>
                        ))}
                </>
            }
        >
            <>
                {reply ? (
                    <BoardsEditReplyForm data={editReplyData} onChangeFormData={handleChangeReplyData} />
                ) : (
                    <BoardsEditForm data={editData} onChangeFormData={handleChangeEditData} />
                )}
            </>
        </MokaCard>
    );
};

export default BoardsEdit;
