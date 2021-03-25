import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { initialState, GET_JPOD_NOTICE_CONTENTS, getJpodNoticeContents, clearJpodBoardContents } from '@store/jpod';
import { uploadBoardContentsImage, updateBoardContents, saveBoardContents, deleteBoardContents } from '@store/board';
import BoardsSummernote from '@pages/Boards/BoardsList/BoardsEdit/BoardsSummernote';
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
    const channelList = useSelector((store) => store.jpod.jpodNotice.channelList);
    const contents = useSelector((store) => store.jpod.jpodNotice.contents);
    const loading = useSelector((store) => store.loading[GET_JPOD_NOTICE_CONTENTS]);

    const [temp, setTemp] = useState(initialState.jpodNotice.contents);
    // const [replyEditData, setReplyEditData] = useState({}); // 답변 정보가 저장 되는 state.

    const [editContents, setEditContents] = useState('');
    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일.
    let fileinputRef = useRef(null);

    // const resetEditData = () => {
    //     setEditData({
    //         ordNo: 1, // 순서 설정 : 일반.
    //         boardId: selectBoard.boardId, // 게시판 ID 값.
    //     });
    //     setUploadFiles([]);
    //     fileinputRef.current = null;
    // };

    /**
     * 입력값 변경
     */
    const handleChangeValue = useCallback(
        (formData) => {
            setTemp({ ...temp, ...formData });
        },
        [temp],
    );

    // // 벨리데이션 체크
    // const checkValidation = () => {
    //     if (!editData.boardId || editData.boardId === null || editData.boardId === undefined) {
    //         messageBox.alert('게시판을 선택해 주세요.');
    //         return true;
    //     }

    //     return false;
    // };

    /**
     * 저장
     */
    const handleClickSavePost = () => {
        //     // 게시판과 다르게 게시판을 선택해야 등록 할수 있어서 체크.
        //     if (checkValidation()) {
        //         return;
        //     }
        //     delete editData.regInfo;
        //     delete editData.modInfo;
        //     dispatch(
        //         saveBoardContents({
        //             boardId: editData.boardId,
        //             contents: {
        //                 ...editData,
        //                 channelId: editData.channelId,
        //                 boardId: null,
        //                 depth: 0,
        //                 indent: 0,
        //             },
        //             files: uploadFiles,
        //             callback: ({ header: { success, message }, body }) => {
        //                 if (success === true) {
        //                     toast.success(message);
        //                     history.push(`${match.path}/${body.boardId}/${body.boardSeq}`);
        //                     dispatch(getJpodNotice());
        //                     dispatch(getBoardContents({ boardId: body.boardId, boardSeq: body.boardSeq }));
        //                 } else {
        //                     const { totalCnt, list } = body;
        //                     if (totalCnt > 0 && Array.isArray(list)) {
        //                         // 에러 메시지 확인.
        //                         messageBox.alert(list[0].reason, () => {});
        //                     } else {
        //                         // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                         messageBox.alert(message, () => {});
        //                     }
        //                 }
        //             },
        //         }),
        //     );
    };

    /**
     * 수정
     */
    const handleClickUpdate = () => {
        //     if (checkValidation()) {
        //         return;
        //     }
        //     delete editData.regInfo;
        //     delete editData.modInfo;
        //     dispatch(
        //         updateBoardContents({
        //             boardId: editData.boardId,
        //             boardSeq: boardSeq.current,
        //             contents: {
        //                 ...editData,
        //                 boardId: null,
        //                 channelId: editData.channelId,
        //                 depth: 0,
        //                 indent: 0,
        //             },
        //             files: uploadFiles,
        //             callback: ({ header: { success, message }, body }) => {
        //                 if (success === true) {
        //                     toast.success(message);
        //                     history.push(`${match.path}/${body.boardId}/${body.boardSeq}`);
        //                     dispatch(getJpodNotice());
        //                     dispatch(getBoardContents({ boardId: body.boardId, boardSeq: body.boardSeq }));
        //                 } else {
        //                     const { totalCnt, list } = body;
        //                     if (totalCnt > 0 && Array.isArray(list)) {
        //                         // 에러 메시지 확인.
        //                         messageBox.alert(list[0].reason, () => {});
        //                     } else {
        //                         // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                         messageBox.alert(message, () => {});
        //                     }
        //                 }
        //             },
        //         }),
        //     );
    };

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
        dispatch(clearJpodBoardContents());
    };

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        //     dispatch(
        //         deleteBoardContents({
        //             boardId: editData.boardId,
        //             boardSeq: boardSeq.current,
        //             callback: ({ header: { success, message }, body }) => {
        //                 if (success === true) {
        //                     toast.success(message);
        //                     history.push(`${match.path}`);
        //                     dispatch(getJpodNotice());
        //                 } else {
        //                     const { totalCnt, list } = body;
        //                     if (totalCnt > 0 && Array.isArray(list)) {
        //                         // 에러 메시지 확인.
        //                         messageBox.alert(list[0].reason, () => {});
        //                     } else {
        //                         // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                         messageBox.alert(message, () => {});
        //                     }
        //                 }
        //             },
        //         }),
        //     );
    };

    /**
     * 답변 저장
     */
    const handleClickReplaySave = () => {
        //     dispatch(
        //         saveBoardReply({
        //             boardId: boardId,
        //             parentBoardSeq: parentBoardSeq,
        //             boardSeq: boardSeq,
        //             contents: {
        //                 boardId: null,
        //                 title: editReplyData.title,
        //                 content: editReplyData.content,
        //                 depth: editData.depth + 1,
        //                 indent: editData.indent + 1,
        //                 ordNo: editData.ordNo,
        //                 channelId: parentBoardSeq && reply ? contentsReply.channelId : editData.channelId,
        //                 titlePrefix1: parentBoardSeq && reply ? contentsReply.titlePrefix1 : editData.titlePrefix1,
        //                 titlePrefix2: parentBoardSeq && reply ? contentsReply.titlePrefix2 : editData.titlePrefix2,
        //             },
        //             files: { attachFile: [] },
        //             callback: ({ header: { success, message }, body }) => {
        //                 if (success === true) {
        //                     toast.success(message);
        //                     history.push(`${match.path}/${boardId}/${body.parentBoardSeq}`);
        //                     dispatch(getListMenuContentsList(boardId));
        //                     dispatch(getListMenuContentsInfo({ boardId: boardId, boardSeq: boardSeq }));
        //                 } else {
        //                     const { totalCnt, list } = body;
        //                     if (totalCnt > 0 && Array.isArray(list)) {
        //                         // 에러 메시지 확인
        //                         messageBox.alert(list[0].reason, () => {});
        //                     } else {
        //                         // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함
        //                         messageBox.alert(message, () => {});
        //                     }
        //                 }
        //             },
        //         }),
        //     );
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

    // useEffect(() => {
    //     if (!boardSeq) {
    //         setEditData({});
    //         setEditContents(' ');
    //         resetEditData(); // 에디터 리셋.
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boardSeq]);

    // useEffect(() => {
    //     if (loading && loading === false) {
    //         setEditData({
    //             ...noticeInfo,
    //             editorYn: noticeInfo.boardInfo && noticeInfo.boardInfo.editorYn,
    //             regInfo: noticeInfo.regDt && noticeInfo.regDt.length > 16 ? `등록 일시: ${noticeInfo.regDt.substr(0, 16)} ${noticeInfo.regName}(${noticeInfo.regId})` : '',
    //             modInfo: noticeInfo.modDt && noticeInfo.modDt.length > 16 ? `수정 일시: ${noticeInfo.modDt.substr(0, 16)} ${noticeInfo.regName}(${noticeInfo.regId})` : '',
    //         });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [loading, noticeInfo]);

    useEffect(() => {
        if (jpodBoard.boardId && boardSeq) {
            dispatch(getJpodNoticeContents({ boardId: jpodBoard.boardId, boardSeq: boardSeq }));
        }
    }, [jpodBoard, boardSeq, dispatch]);

    useEffect(() => {
        setTemp(contents);
    }, [contents]);

    return (
        <MokaCard
            className="w-100 flex-fill"
            title={boardSeq ? '게시글 수정' : '게시글 등록'}
            loading={loading}
            bodyClassName="d-flex flex-column"
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {!boardSeq && (
                        // 게시글 등록
                        <>
                            <Button variant="positive" className="mr-1" onClick={handleClickSavePost}>
                                저장
                            </Button>
                            <Button variant="negative" onClick={handleClickCancel}>
                                취소
                            </Button>
                        </>
                    )}
                    {boardSeq && (
                        // 게시글 조회
                        <>
                            <Button variant="positive" className="mr-1" onClick={handleClickUpdate}>
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
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    수정
                                </Button>
                                <Button variant="negative" className="mr-1" onClick={handleClickReplayDelete}>
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
                    <NoticeEditReplyForm
                    // data={editReplyData}
                    // onChangeFormData={handleChangeEditData}
                    />
                ) : (
                    <NoticeEditForm data={temp} onChange={handleChangeValue} />
                )}
            </>
        </MokaCard>
    );
};

export default NoticeEdit;
