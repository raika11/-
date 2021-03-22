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
const BoardsEdit = () => {
    const history = useHistory();
    const { boardId, boardSeq, parentBoardSeq, reply } = useParams();
    const dispatch = useDispatch();

    const pagePathName = useSelector((store) => store.board.pagePathName);
    const storeBoardType = useSelector((store) => store.board.boardType);
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);
    const contentsInfo = useSelector((store) => store.board.listMenu.contents.info);
    const contentsReply = useSelector((store) => store.board.listMenu.contents.reply);
    const loading = useSelector((store) => store.loading[GET_LIST_MENU_CONTENTS_INFO]);

    const [title, setTitle] = useState('');
    const [noteReady, setNoteReady] = useState();
    const [editData, setEditData] = useState(initialState.listMenu.contents.info); // 게시글 정보가 저장되는 state
    const [editReplyData, setEditReplyData] = useState(initialState.listMenu.contents.reply); // 답변 정보가 저장되는 state

    // 글보기, 글 수정, 답변 달기 , 답변 수정 기능에 edit 컴포넌트를 변경 시켜 주기 위해서 state 를 사용.
    // const [editState, setEditState] = useState(initialEditState);

    /**
     * BoardsEditForm change value
     */
    const handleChangeEditData = useCallback(
        (e) => {
            const { name, value, checked, type } = e.target;

            if (type === 'checkbox') {
                setEditData({ ...editData, [name]: checked === true ? 'Y' : 'N' });
            } else {
                setEditData({ ...editData, [name]: value });
            }
        },
        [editData],
    );

    const handleChangeReplyData = (e) => {
        const { name, value } = e.target;

        setEditReplyData({ ...editReplyData, [name]: value });
    };

    const makeServiceFormData = () => {
        var formData = new FormData();
        formData.append('depth', 0);
        formData.append('indent', 0);
        formData.append('channelId', editData.channelId);
        formData.append('content', contentsInfo.content);
        formData.append('ordNo', editData.ordNo);
        formData.append('title', editData.title);
        formData.append('pushReceiveYn', editData.pushReceiveYn);
        formData.append('emailReceiveYn', editData.emailReceiveYn);
        formData.append('email', editData.email);

        formData.append('titlePrefix1', editData.titlePrefix1);
        formData.append('titlePrefix2', editData.titlePrefix2);

        editData.attaches.map((element, index) => {
            if (element.seqNo > 0) {
                formData.append(`attaches[${index}].seqNo`, element.seqNo);
            } else {
                formData.append(`attaches[${index}].attachFile`, element);
                formData.append(`attaches[${index}].seqNo`, 0);
            }

            return true;
        });

        return formData;
    };
    const makeAdminFormData = () => {};

    // 게시글 저장 버튼 클릭.
    const handleClickContentsSave = () => {
        // let formData = {}; // 폼데이터.
        // if (storeBoardType === 'S') {
        //     formData = makeServiceFormData();
        // } else {
        //     formData = makeAdminFormData();
        // }
        // dispatch(
        //     saveBoardContents({
        //         boardId: editState.boardId,
        //         formData: formData,
        //         callback: ({ header: { success, message }, body }) => {
        //             if (success === true) {
        //                 toast.success(message);
        //                 history.push(`/${pagePathName}/${editState.boardId}/${body.boardSeq}`);
        //                 dispatch(getListMenuContentsList(editState.boardId));
        //             } else {
        //                 const { totalCnt, list } = body;
        //                 if (totalCnt > 0 && Array.isArray(list)) {
        //                     // 에러 메시지 확인.
        //                     messageBox.alert(list[0].reason, () => {});
        //                 } else {
        //                     // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                     messageBox.alert(message, () => {});
        //                 }
        //             }
        //         },
        //     }),
        // );
    };

    // 게시글 수정 버튼 클릭.
    const handleClickUpdate = () => {
        // let formData = {}; // 폼데이터.
        // if (storeBoardType === 'S') {
        //     formData = makeServiceFormData();
        // } else {
        //     formData = makeAdminFormData();
        // }
        // dispatch(
        //     updateBoardContents({
        //         boardId: editState.boardId,
        //         boardSeq: editState.boardSeq,
        //         formData: formData,
        //         callback: ({ header: { success, message }, body }) => {
        //             if (success === true) {
        //                 toast.success(message);
        //                 const { boardSeq } = body;
        //                 history.push(`/${pagePathName}/${editState.boardId}/${boardSeq}`);
        //                 dispatch(getListMenuContentsList(editState.boardId));
        //                 dispatch(getListMenuContentsInfo({ boardId: editState.boardId, boardSeq: boardSeq }));
        //             } else {
        //                 const { totalCnt, list } = body;
        //                 if (totalCnt > 0 && Array.isArray(list)) {
        //                     // 에러 메시지 확인.
        //                     messageBox.alert(list[0].reason, () => {});
        //                 } else {
        //                     // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                     messageBox.alert(message, () => {});
        //                 }
        //             }
        //         },
        //     }),
        // );
    };

    // 게시글 취소 버튼 클릭.
    const handleClickCancle = () => {
        // history.push(`/${pagePathName}/${editState.boardId}`);
    };

    // 게시글 삭제 버튼 클릭.
    const handleClickDelete = () => {
        // dispatch(
        //     deleteBoardContents({
        //         boardId: editState.boardId,
        //         boardSeq: editState.boardSeq,
        //         callback: ({ header: { success, message }, body }) => {
        //             if (success === true) {
        //                 toast.success(message);
        //                 history.push(`/${pagePathName}/${editState.boardId}`);
        //                 dispatch(getListMenuContentsList(editState.boardId));
        //             } else {
        //                 const { totalCnt, list } = body;
        //                 if (totalCnt > 0 && Array.isArray(list)) {
        //                     // 에러 메시지 확인.
        //                     messageBox.alert(list[0].reason, () => {});
        //                 } else {
        //                     // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                     messageBox.alert(message, () => {});
        //                 }
        //             }
        //         },
        //     }),
        // );
    };

    /**
     * 답변 버튼
     */
    const handleClickReplay = () => {
        setTitle('답변 등록');
        // history.push(`/${pagePathName}/${editState.boardId}/${editState.boardSeq}/reply`);
    };

    // 답변 저장 버튼 클릭.
    const handleClickReplaySave = () => {
        // dispatch(
        //     saveBoardReply({
        //         boardId: editState.boardId,
        //         parentBoardSeq: editState.parentBoardSeq === editState.boardSeq ? null : editState.parentBoardSeq,
        //         boardSeq: editState.boardSeq,
        //         contents: {
        //             ...editReplayData,
        //             boardId: null,
        //             content: contentsReply.content,
        //             depth: 0,
        //             indent: 0,
        //             ordNo: editData.ordNo,
        //             channelId: editState.mode === 'add' ? editData.channelId : contentsReply.channelId,
        //             titlePrefix1: editState.mode === 'add' ? editData.titlePrefix1 : contentsReply.titlePrefix1,
        //             titlePrefix2: editState.mode === 'add' ? editData.titlePrefix2 : contentsReply.titlePrefix2,
        //             addr: editData.addr,
        //         },
        //         files: { attachFile: [] },
        //         callback: ({ header: { success, message }, body }) => {
        //             if (success === true) {
        //                 toast.success(message);
        //                 history.push(`/${pagePathName}/${editState.boardId}/${body.parentBoardSeq}`);
        //                 dispatch(getListMenuContentsList(editState.boardId));
        //                 dispatch(getListMenuContentsInfo({ boardId: editState.boardId, boardSeq: editState.boardSeq }));
        //             } else {
        //                 const { totalCnt, list } = body;
        //                 if (totalCnt > 0 && Array.isArray(list)) {
        //                     // 에러 메시지 확인.
        //                     messageBox.alert(list[0].reason, () => {});
        //                 } else {
        //                     // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                     messageBox.alert(message, () => {});
        //                 }
        //             }
        //         },
        //     }),
        // );
    };
    // 답변 삭제 버튼 클릭.
    const handleClickReplayDelete = () => {};

    // 답변 취소 버튼 클릭
    const handleClickReplayCancle = () => {
        // if (contentsInfo.boardSeq === null) {
        //     history.push(`/${pagePathName}/${editState.boardId}`);
        // } else {
        //     history.push(`/${pagePathName}/${editState.boardId}/${editState.boardSeq}`);
        // }
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
            if (parentBoardSeq) {
                setTitle('답변 수정');
            } else {
                setTitle('게시글 수정');
            }
        } else {
            setTitle('게시글 등록');
        }
    }, [boardSeq, parentBoardSeq]);

    useEffect(() => {
        // store 게시글 상세 정보를 local state로 셋팅
        setEditData(contentsInfo);
    }, [contentsInfo]);

    useEffect(() => {
        // store 답글 상세 정보를 local state로 셋팅
        setEditReplyData(contentsReply);
    }, [contentsReply]);

    // useEffect(() => {
    //     // useRef 현재 선택된 게시판, 게시글 정보 설정.
    //     let tempEditState = editState;

    //     if (!isNaN(Number(boardId)) && editState.boardId !== boardId) {
    //         tempEditState = { ...tempEditState, boardId: boardId };
    //     }

    //     if (!isNaN(Number(boardSeq)) && tempEditState.boardSeq !== boardSeq) {
    //         tempEditState = { ...tempEditState, boardSeq: boardSeq };
    //     }

    //     if (!isNaN(Number(parentBoardSeq)) && tempEditState.parentBoardSeq !== parentBoardSeq) {
    //         tempEditState = { ...tempEditState, parentBoardSeq: parentBoardSeq };
    //     }

    //     if (boardSeq === 'add') {
    //         tempEditState = { ...tempEditState, page: 'board', mode: 'add', title: '게시글 등록' };
    //     } else if (reply) {
    //         if (parentBoardSeq && boardSeq) {
    //             tempEditState = { ...tempEditState, page: 'reply', mode: 'modify', title: '답변 수정' };
    //         } else {
    //             tempEditState = { ...tempEditState, page: 'reply', mode: 'add', title: '답변 등록' };
    //         }
    //     } else {
    //         tempEditState = { ...tempEditState, page: 'board', mode: 'modify', title: '게시글 수정' };
    //     }

    //     setEditState(tempEditState);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boardId, boardSeq, parentBoardSeq]);

    useEffect(() => {
        setNoteReady(loading);
    }, [loading]);

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
                    {!boardSeq && !parentBoardSeq && (
                        <>
                            <Button variant="positive" className="mr-1" onClick={handleClickContentsSave}>
                                저장
                            </Button>
                            <Button variant="negative" onClick={handleClickCancle}>
                                취소
                            </Button>
                        </>
                    )}
                    {boardSeq && !parentBoardSeq && (
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
                    {parentBoardSeq &&
                        (reply ? (
                            <>
                                <Button variant="negative" className="mr-1" onClick={handleClickReplay}>
                                    답변
                                </Button>
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    수정
                                </Button>
                                <Button variant="negative" className="mr-1" onClick={handleClickReplayDelete}>
                                    삭제
                                </Button>
                                <Button variant="negative" onClick={handleClickReplayCancle}>
                                    취소
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="positive" className="mr-1" onClick={handleClickReplaySave}>
                                    저장
                                </Button>
                                <Button variant="negative" onClick={handleClickReplayCancle}>
                                    취소
                                </Button>
                            </>
                        ))}
                </>
            }
        >
            <>
                {
                    parentBoardSeq ? (
                        <BoardsEditReplyForm data={editReplyData} setEditReplayData={setEditReplyData} onChangeFormData={handleChangeReplyData} />
                    ) : (
                        <BoardsEditForm data={editData} onChangeFormData={handleChangeEditData} />
                    )
                    //     if (editState.page === 'board' && (editState.mode === 'add' || editState.mode === 'modify')) {
                    //         return <BoardsEditForm EditState={editState} EditData={editData} HandleChangeFormData={(e) => handleEditDataChange(e)} />;
                    //     } else if (loading === false && editState.page === 'reply' && (editState.mode === 'add' || editState.mode === 'modify')) {
                    //         return (
                    //             <BoardsEditReplyForm
                    //                 EditState={editState}
                    //                 EditData={editReplayData}
                    //                 setEditReplayData={setEditReplayData}
                    //                 HandleChangeFormData={(e) => handleReplyEditDataChange(e)}
                    //             />
                    //         );
                    //     }
                    // }
                }
            </>
        </MokaCard>
    );
};

// 에디트 상태 및 에디트 타이틀 명.
// const initialEditState = {
//     page: 'board',
//     mode: 'add',
//     title: '게시글 등록',
//     boardId: null,
//     boardSeq: null,
//     parentBoardSeq: null,
//     boardReply: false,
//     boardAdd: false,
// };

export default BoardsEdit;
