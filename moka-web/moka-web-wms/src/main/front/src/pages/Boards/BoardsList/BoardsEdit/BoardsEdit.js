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
        },
        [editData],
    );

    /**
     * 답변 폼 입력값 변경
     */
    const handleChangeReplyData = useCallback(
        (formData) => {
            setEditReplyData({ ...editReplyData, ...formData });
        },
        [editReplyData],
    );

    /**
     * 게시글 저장
     */
    const handleClickContentsSave = () => {
        let saveObj = {
            ...editData,
            boardId: boardId,
            boardSeq: boardSeq || null,
        };
        dispatch(
            saveBoardContents({
                boardContents: saveObj,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`${match.path}/${boardId}/${body.boardSeq}`);
                    } else {
                        if (Array.isArray(body.list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(body.list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert
                            messageBox.alert(header.message, () => {});
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
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/${boardId}`);
                        } else {
                            if (Array.isArray(body.list)) {
                                // 에러 메시지 확인.
                                messageBox.alert(body.list[0].reason, () => {});
                            } else {
                                // 에러이지만 에러메시지가 없으면 서버 메시지를 alert
                                messageBox.alert(header.message, () => {});
                            }
                        }
                    },
                }),
            );
        });
    };

    /**
     * 게시글 취소
     */
    const handleClickCancel = () => {
        history.push(`${match.path}/${boardId}`);
    };

    /**
     * 답변 등록
     */
    const handleClickReplay = () => {
        history.push(`${match.path}/${boardId}/${boardSeq}/reply`);
    };

    /**
     * 답변 저장
     */
    const handleClickReplaySave = () => {
        dispatch(
            saveBoardReply({
                boardId: boardId,
                parentBoardSeq: parentBoardSeq,
                boardSeq: boardSeq,
                contents: {
                    parentBoardSeq: contentsReply?.parentBoardSeq,
                    title: editReplyData.title,
                    content: editReplyData.content,
                    depth: contentsInfo.boardId ? editData.maxDepth + 1 : contentsReply.depth,
                    indent: contentsInfo.boardId ? editData.indent + 1 : contentsReply.indent + 1,
                    ordNo: editData.ordNo || editReplyData.ordNo,
                    channelId: editData.channelId || editReplyData.channelId,
                    titlePrefix1: editData.titlePrefix1 || editReplyData.titlePrefix1,
                    titlePrefix2: editData.titlePrefix2 || editReplyData.titlePrefix2,
                },
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`${match.path}/${boardId}/${body.parentBoardSeq}/reply/${body.boardSeq}`);
                    } else {
                        if (Array.isArray(body.list)) {
                            // 에러 메시지 확인
                            messageBox.alert(body.list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert
                            messageBox.alert(header.message, () => {});
                        }
                    }
                },
            }),
        );
    };

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
                            <Button variant="negative" onClick={handleClickCancel}>
                                취소
                            </Button>
                        </>
                    )}
                    {boardSeq && !parentBoardSeq && !reply && (
                        // 게시글 조회
                        <>
                            {selectBoard.answYn === 'Y' && (
                                <Button variant="outline-neutral" className="mr-1" onClick={handleClickReplay}>
                                    답변
                                </Button>
                            )}
                            <Button variant="positive" className="mr-1" onClick={handleClickContentsSave}>
                                수정
                            </Button>
                            <Button variant="negative" className="mr-1" onClick={handleClickDelete}>
                                삭제
                            </Button>
                            <Button variant="negative" onClick={handleClickCancel}>
                                취소
                            </Button>
                        </>
                    )}
                    {boardSeq &&
                        reply &&
                        (parentBoardSeq ? (
                            // 답변 조회
                            <>
                                {selectBoard.answYn === 'Y' && (
                                    <Button variant="outline-neutral" className="mr-1" onClick={handleClickReplay}>
                                        답변
                                    </Button>
                                )}
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    수정
                                </Button>
                                <Button variant="negative" className="mr-1" onClick={handleClickDelete}>
                                    삭제
                                </Button>
                                <Button variant="negative" onClick={handleClickCancel}>
                                    취소
                                </Button>
                            </>
                        ) : (
                            // 답변 등록
                            <>
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    저장
                                </Button>
                                <Button variant="negative" onClick={handleClickCancel}>
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
