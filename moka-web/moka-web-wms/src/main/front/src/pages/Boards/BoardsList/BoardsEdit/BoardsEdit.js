import React, { useState, useEffect, useCallback } from 'react';
import { MokaCard } from '@components';
import { Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';

import {
    initialState,
    GET_LISTMENU_CONTENTS_INFO,
    getListmenuContentsInfo,
    saveBoardContents,
    updateBoardContents,
    getListmenuContentsList,
    saveBoardReply,
    deleteBoardContents,
} from '@store/board';

import BoardsEditForm from './BoardsEditForm';
import BoardsEditReplyForm from './BoardsEditReplyForm';

const BoardsEdit = () => {
    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    // 공통 구분값 URL
    const { pagePathName, boardType: storeBoardType, selectboard, contentsinfo, contentsreply, loading } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        boardType: store.board.boardType,
        selectboard: store.board.listmenu.selectboard,
        contentsinfo: store.board.listmenu.contents.info,
        contentsreply: store.board.listmenu.contents.reply,
        userName: store.app.AUTH.userName,
        loading: store.loading[GET_LISTMENU_CONTENTS_INFO],
    }));

    const [editData, setEditData] = useState(initialState.listmenu.contents.info); // 게시글 정보가 저장되는 state
    const [editReplayData, setEditReplayData] = useState(initialState.listmenu.contents.info); // 답변 정보가 저장되는 state

    // 글보기, 글 수정, 답변 달기 , 답변 수정 기능에 edit 컴포넌트를 변경 시켜 주기 위해서 state 를 사용.
    const [editState, setEditState] = useState(initialEditState);

    // 폼 input 데이터 변경 처리.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleEditDataChange = useCallback((e) => {
        let tempObject = {};
        const { name, value, checked, type } = e.target;

        if (type === 'checkbox') {
            tempObject = {
                ...editData,
                [name]: checked === true ? 'Y' : 'N',
            };
        } else {
            tempObject = {
                ...editData,
                [name]: value,
            };
        }

        setEditData(tempObject);
    });

    const handleReplyEditDataChange = (e) => {
        const { name, value } = e.target;

        setEditReplayData({
            ...editReplayData,
            [name]: value,
        });
    };

    const makeServiceFormData = () => {
        var formData = new FormData();
        formData.append('depth', 0);
        formData.append('indent', 0);
        formData.append('channelId', editData.channelId);
        formData.append('content', contentsinfo.content);
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
    const handleClickContentsSaveButton = () => {
        let formData = {}; // 폼데이터.

        if (storeBoardType === 'S') {
            formData = makeServiceFormData();
        } else {
            formData = makeAdminFormData();
        }

        dispatch(
            saveBoardContents({
                boardId: editState.boardId,
                formData: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`/${pagePathName}/${editState.boardId}/${body.boardSeq}`);
                        dispatch(getListmenuContentsList({ boardId: editState.boardId }));
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

    // 게시글 수정 버튼 클릭.
    const handleClickUpdateButton = () => {
        let formData = {}; // 폼데이터.

        if (storeBoardType === 'S') {
            formData = makeServiceFormData();
        } else {
            formData = makeAdminFormData();
        }

        dispatch(
            updateBoardContents({
                boardId: editState.boardId,
                boardSeq: editState.boardSeq,
                formData: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { boardSeq } = body;
                        history.push(`/${pagePathName}/${editState.boardId}/${boardSeq}`);
                        dispatch(getListmenuContentsList({ boardId: editState.boardId }));
                        dispatch(getListmenuContentsInfo({ boardId: editState.boardId, boardSeq: boardSeq }));
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

    // 게시글 취소 버튼 클릭.
    const handleClickCancleButton = () => {
        history.push(`/${pagePathName}/${editState.boardId}`);
    };

    // 게시글 삭제 버튼 클릭.
    const handleClickDeleteButton = () => {
        dispatch(
            deleteBoardContents({
                boardId: editState.boardId,
                boardSeq: editState.boardSeq,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`/${pagePathName}/${editState.boardId}`);
                        dispatch(getListmenuContentsList({ boardId: editState.boardId }));
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

    // 답변 버튼 클릭.
    const handleClickReplayButton = () => {
        history.push(`/${pagePathName}/${editState.boardId}/${editState.boardSeq}/reply`);
    };

    // 답변 저장 버튼 클릭.
    const handleClickReplaySaveButton = () => {
        dispatch(
            saveBoardReply({
                boardId: editState.boardId,
                parentBoardSeq: editState.parentBoardSeq === editState.boardSeq ? null : editState.parentBoardSeq,
                boardSeq: editState.boardSeq,
                contents: {
                    ...editReplayData,
                    boardId: null,
                    content: contentsreply.content,
                    depth: 0,
                    indent: 0,
                    ordNo: editData.ordNo,
                    channelId: editState.mode === 'add' ? editData.channelId : contentsreply.channelId,
                    titlePrefix1: editState.mode === 'add' ? editData.titlePrefix1 : contentsreply.titlePrefix1,
                    titlePrefix2: editState.mode === 'add' ? editData.titlePrefix2 : contentsreply.titlePrefix2,
                    addr: editData.addr,
                },
                files: { attachFile: [] },
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`/${pagePathName}/${editState.boardId}/${body.parentBoardSeq}`);
                        dispatch(getListmenuContentsList({ boardId: editState.boardId }));
                        dispatch(getListmenuContentsInfo({ boardId: editState.boardId, boardSeq: editState.boardSeq }));
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
    // 답변 삭제 버튼 클릭.
    const handleClickReplayDeleteButton = () => {};

    // 답변 취소 버튼 클릭.
    const handleClickReplayCancleButton = () => {
        if (contentsinfo.boardSeq === null) {
            history.push(`/${pagePathName}/${editState.boardId}`);
        } else {
            history.push(`/${pagePathName}/${editState.boardId}/${editState.boardSeq}`);
        }
    };

    // useRef 현재 선택된 게시판, 게시글 정보 설정.
    useEffect(() => {
        let tempEditState = editState;

        if (!isNaN(Number(params.boardId)) && editState.boardId !== params.boardId) {
            tempEditState = { ...tempEditState, boardId: params.boardId };
        }

        if (!isNaN(Number(params.boardSeq)) && tempEditState.boardSeq !== params.boardSeq) {
            tempEditState = { ...tempEditState, boardSeq: params.boardSeq };
        }

        if (!isNaN(Number(params.parentBoardSeq)) && tempEditState.parentBoardSeq !== params.parentBoardSeq) {
            tempEditState = { ...tempEditState, parentBoardSeq: params.parentBoardSeq };
        }

        if (params.boardSeq === 'add') {
            tempEditState = { ...tempEditState, page: 'board', mode: 'add', title: '게시글 등록' };
        } else if (params.reply) {
            if (params.parentBoardSeq && params.boardSeq) {
                tempEditState = { ...tempEditState, page: 'reply', mode: 'modify', title: '답변 수정' };
            } else {
                tempEditState = { ...tempEditState, page: 'reply', mode: 'add', title: '답변 등록' };
            }
        } else {
            tempEditState = { ...tempEditState, page: 'board', mode: 'modify', title: '게시글 수정' };
        }

        setEditState(tempEditState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        if (params.boardSeq !== 'add') {
            setEditData({
                ...contentsinfo,
                regInfo: `등록 일시: ${contentsinfo && contentsinfo.regDt && contentsinfo.regDt.length > 16 ? contentsinfo.regDt.substr(0, 16) : contentsinfo.regDt} ${
                    contentsinfo.regName
                }`,
                modInfo: `수정 일시: ${contentsinfo && contentsinfo.modDt && contentsinfo.modDt.length > 16 ? contentsinfo.modDt.substr(0, 16) : contentsinfo.modDt} ${
                    contentsinfo.regName
                }`,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentsinfo]);

    useEffect(() => {
        if (contentsinfo === initialState.listmenu.contents.info) {
            setEditData(initialState.listmenu.contents.info);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentsinfo]);

    useEffect(() => {
        if (params.boardId && params.boardSeq && params.boardSeq !== 'add') {
            dispatch(getListmenuContentsInfo({ boardId: params.boardId, boardSeq: params.boardSeq }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            setEditData(initialState.listmenu.contents.info);
        };
    }, []);

    return (
        <MokaCard
            width={550}
            title={editState.title}
            loading={loading}
            className="flex-fill"
            bodyClassName="d-flex flex-column"
            footer
            footerClassName="justify-content-center"
            footerAs={
                <>
                    {/* 하단 버튼 처리. */}
                    {(function () {
                        // 하단 버튼 등록 일때.
                        if (editState.page === 'board') {
                            if (editState.mode === 'add') {
                                return (
                                    <div className="justify-content-md-center text-center">
                                        <Button variant="positive" className="mr-1" onClick={() => handleClickContentsSaveButton()}>
                                            저장
                                        </Button>
                                        <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                            취소
                                        </Button>
                                    </div>
                                );
                                // 하단 버튼 보기, 수정 일때.
                            } else if (editState.mode === 'modify') {
                                return (
                                    <div className="justify-content-md-center text-center">
                                        {selectboard.answYn === 'Y' && (
                                            <Button variant="negative" className="mr-1" onClick={() => handleClickReplayButton()}>
                                                답변
                                            </Button>
                                        )}
                                        <Button variant="positive" className="mr-1" onClick={() => handleClickUpdateButton()}>
                                            수정
                                        </Button>
                                        <Button variant="negative" className="mr-1" onClick={() => handleClickCancleButton()}>
                                            취소
                                        </Button>
                                        <Button variant="negative" className="mr-1" onClick={() => handleClickDeleteButton()}>
                                            삭제
                                        </Button>
                                    </div>
                                );
                                // 하단 버튼 답글 일때.
                            }
                        } else if (editState.page === 'reply') {
                            if (editState.mode === 'add') {
                                return (
                                    <div className="justify-content-md-center text-center">
                                        <Button variant="positive" className="mr-1" onClick={() => handleClickReplaySaveButton()}>
                                            저장
                                        </Button>
                                        <Button variant="negative" onClick={() => handleClickReplayCancleButton()}>
                                            취소
                                        </Button>
                                    </div>
                                );
                            } else if (editState.mode === 'modify') {
                                <div className="justify-content-md-center text-center">
                                    <Button variant="positive" className="mr-1" onClick={() => handleClickReplaySaveButton()}>
                                        수정
                                    </Button>
                                    <Button variant="negative" className="mr-1" onClick={() => handleClickReplayCancleButton()}>
                                        취소
                                    </Button>
                                    <Button variant="negative" className="mr-1" onClick={() => handleClickReplayDeleteButton()}>
                                        삭제
                                    </Button>
                                </div>;
                            }
                        }
                    })()}
                </>
            }
        >
            <>
                {(function () {
                    if (editState.page === 'board' && (editState.mode === 'add' || editState.mode === 'modify')) {
                        return <BoardsEditForm EditState={editState} EditData={editData} HandleChangeFormData={(e) => handleEditDataChange(e)} />;
                    } else if (loading === false && editState.page === 'reply' && (editState.mode === 'add' || editState.mode === 'modify')) {
                        return (
                            <BoardsEditReplyForm
                                EditState={editState}
                                EditData={editReplayData}
                                setEditReplayData={setEditReplayData}
                                HandleChangeFormData={(e) => handleReplyEditDataChange(e)}
                            />
                        );
                    }
                })()}
            </>
        </MokaCard>
    );
};

// 에디트 상태 및 에디트 타이틀 명.
const initialEditState = {
    page: 'board',
    mode: 'add',
    title: '게시글 등록',
    boardId: null,
    boardSeq: null,
    parentBoardSeq: null,
    boardReply: false,
    boardAdd: false,
};

export default BoardsEdit;
