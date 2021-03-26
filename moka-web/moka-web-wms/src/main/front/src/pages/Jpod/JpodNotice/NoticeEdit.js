import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaCard } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import {
    initialState,
    GET_JPOD_NOTICE_CONTENTS,
    getJpodNoticeContents,
    clearJpodNoticeContents,
    saveJpodBoardContents,
    deleteJpodNoticeContents,
    saveJpodNoticeReply,
} from '@store/jpod';
import { uploadBoardContentsImage, updateBoardContents } from '@store/board';
import NoticeEditForm from './NoticeEditForm';
import NoticeEditReplyForm from './NoticeEditReplyForm';

/**
 * J팟 관리 - 공지 게시판 수정 / 등록
 */
const NoticeEdit = ({ match }) => {
    const { boardSeq, parentBoardSeq, reply } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const jpodBoard = useSelector((store) => store.jpod.jpodNotice.jpodBoard);
    const contents = useSelector((store) => store.jpod.jpodNotice.contents);
    const storeReply = useSelector((store) => store.jpod.jpodNotice.reply);
    const loading = useSelector((store) => store.loading[GET_JPOD_NOTICE_CONTENTS]);

    const [title, setTitle] = useState('');
    const [temp, setTemp] = useState(initialState.jpodNotice.contents); // 게시글 정보
    const [replyTemp, setReplyTemp] = useState(initialState.jpodNotice.reply); // 답변 정보

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        (formData) => {
            setTemp({ ...temp, ...formData });
        },
        [temp],
    );

    const handleChangeReplyValue = useCallback(
        (formData) => {
            setReplyTemp({ ...replyTemp, ...formData });
        },
        [replyTemp],
    );

    /**
     * 저장
     */
    const handleClickBoardSave = () => {
        let saveObj = {
            ...temp,
            boardId: jpodBoard.boardId,
            boardSeq: boardSeq ? boardSeq : null,
        };

        if (jpodBoard.boardId) {
            dispatch(
                saveJpodBoardContents({
                    boardContents: saveObj,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/${body.boardSeq}`);
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
        }
    };

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm('삭제 하시겠습니까?', () => {
            dispatch(
                deleteJpodNoticeContents({
                    boardId: jpodBoard.boardId,
                    boardSeq: boardSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}`);
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
     * 답변 등록
     */
    const handleClickReplay = () => {
        history.push(`${match.path}/${boardSeq}/reply`);
    };

    /**
     * 답변 저장
     */
    const handleClickReplaySave = () => {
        dispatch(
            saveJpodNoticeReply({
                boardId: jpodBoard.boardId,
                parentBoardSeq: parentBoardSeq,
                boardSeq: boardSeq,
                contents: {
                    // boardId: null,
                    title: replyTemp.title,
                    content: replyTemp.content,
                    depth: temp.depth + 1,
                    indent: temp.indent + 1,
                    ordNo: temp.ordNo,
                    channelId: temp.channelId,
                    titlePrefix1: temp.titlePrefix1,
                    titlePrefix2: temp.titlePrefix2,
                },
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`${match.path}/${body.parentBoardSeq}/reply/${body.boardSeq}`);
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

    const handleClickReplayDelete = () => {};

    // summernote 이미지 업로드 처리.
    const summerNoteImageUpload = (file) => {
        //     const formData = new FormData();
        //     formData.append('attachFile', file[0]);
        //     dispatch(
        //         uploadBoardContentsImage({
        //             boardId: editData.boardId,
        //             imageForm: formData,
        //             callback: ({ header: { success, message }, body }) => {
        //                 if (success === true) {
        //                     toast.success(message);
        //                     setEditData({
        //                         ...editData,
        //                         content: `${editData.content} <img src="${body}">`,
        //                     });
        //                     // else {
        //                     //     setReplyEditData({
        //                     //         ...replyEditData,
        //                     //         content: `${replyEditData.content} <img src="${body}">`,
        //                     //     });
        //                     // }
        //                 } else {
        //                     const { totalCnt, list } = body;
        //                     if (totalCnt > 0 && Array.isArray(list)) {
        //                         // 에러 메시지 확인.
        //                         messageBox.alert(list[0].reason, () => {});
        //                     } else {
        //                         // body에 에러메시지가 없으면 서버 메시지를 alert 함.
        //                         messageBox.alert(message, () => {});
        //                     }
        //                 }
        //             },
        //         }),
        //     );
    };

    useEffect(() => {
        // J팟 게시판이 존재하고 boardSeq params가 있으면 게시글 상세 조회 없으면 조회값 초기화
        if (jpodBoard.boardId && boardSeq) {
            dispatch(getJpodNoticeContents({ boardId: jpodBoard.boardId, boardSeq: boardSeq }));
        } else if (jpodBoard.boardId && !boardSeq) {
            dispatch(clearJpodNoticeContents());
        }
    }, [jpodBoard, boardSeq, dispatch]);

    useEffect(() => {
        // store의 조회 값이 변경 되면 local state 변경
        setTemp(contents);
    }, [contents]);

    useEffect(() => {
        // store의 조회 값이 변경 되면 local state 변경
        setReplyTemp(storeReply);
    }, [storeReply]);

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

    return (
        <MokaCard
            className="w-100 flex-fill"
            title={title}
            loading={loading}
            bodyClassName="d-flex flex-column"
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {!boardSeq && (
                        // 게시글 등록
                        <>
                            <Button variant="positive" className="mr-1" onClick={handleClickBoardSave}>
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
                            {jpodBoard.answYn === 'Y' && (
                                <Button variant="outline-neutral" className="mr-1" onClick={handleClickReplay}>
                                    답변
                                </Button>
                            )}
                            <Button variant="positive" className="mr-1" onClick={handleClickBoardSave}>
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
                                {jpodBoard.answYn === 'Y' && (
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
            {reply ? <NoticeEditReplyForm data={replyTemp} onChange={handleChangeReplyValue} /> : <NoticeEditForm data={temp} onChange={handleChangeValue} />}
        </MokaCard>
    );
};

export default NoticeEdit;
