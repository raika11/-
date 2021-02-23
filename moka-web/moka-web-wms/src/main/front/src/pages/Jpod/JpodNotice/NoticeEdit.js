import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { MokaCard, MokaInputLabel, MokaInput, MokaTableEditCancleButton } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import toast, { messageBox } from '@utils/toastUtil';

import { selectItem } from '@pages/Boards/BoardConst';
import { GET_BOARD_CONTENTS, clearBoardContents, changeSelectBoard, clearSelectBoard, getJpodNotice, getBoardContents } from '@store/jpod';

import { uploadBoardContentImage, updateBoardContents, saveBoardReply, saveBoardContents, deleteBoardContents } from '@store/board';

import BoardRepoterSelect from '@pages/Boards/BoardsList/BoardsEdit/BoardRepoterSelect';
import BoardsSummernote from '@pages/Boards/BoardsList/BoardsEdit/BoardsSummernote';

const NoticeEdit = ({ match }) => {
    const history = useHistory();
    const params = useParams();
    const boardId = useRef(null);
    const boardSeq = useRef(null);
    const dispatch = useDispatch();
    const parentBoardSeq = useRef(null);

    const { noticeInfo, loading, selectBoard, boardList, channelList, noticereply } = useSelector((store) => ({
        noticeInfo: store.jpod.jpodNotice.noticeInfo,
        noticereply: store.jpod.jpodNotice.noticereply,
        boardList: store.jpod.jpodNotice.boardList,
        channelList: store.jpod.jpodNotice.channelList,
        selectBoard: store.jpod.jpodNotice.selectBoard,
        loading: store.loading[GET_BOARD_CONTENTS],
    }));

    const [editState, setEditState] = useState(initialEditState); // 글보기, 글 수정, 답변 달기 , 답변 수정 기능에 edit 컴포넌트를 변경 시켜 주기 위해서 state 를 사용함.
    const [editData, setEditData] = useState({});
    const [selectReport, setSelectReport] = useState([]); // 기자 선택.
    const [replyEditData, setReplyEditData] = useState({}); // 답변 정보가 저장 되는 state.

    const [editContents, setEditContents] = useState('');
    const [replyEditContents, setReplyEditContents] = useState('');
    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일.
    let fileinputRef = useRef(null);

    const resetEditData = () => {
        setEditData({});
        setUploadFiles([]);
        dispatch(clearBoardContents());
        dispatch(clearSelectBoard());
        fileinputRef.current = null;
    };

    // 게시글 데이터 변경시 스테이트 업데이트.
    const handleChangeFormData = useCallback(
        (e) => {
            const { name, value } = e.target;
            setEditData({
                ...editData,
                [name]: value,
            });
        },
        [editData],
    );

    // 벨리데이션 체크
    const checkValidation = () => {
        if (!editData.boardId || editData.boardId === null || editData.boardId === undefined) {
            messageBox.alert('게시판을 선택해 주세요.');
            return true;
        }

        return false;
    };

    // 저장 버튼 클릭 처리.
    const handleClickContentsSaveButton = () => {
        // 게시판과 다르게 게시판을 선택해야 등록 할수 있어서 체크.
        if (checkValidation()) {
            return;
        }
        delete editData.regInfo;
        delete editData.modInfo;

        dispatch(
            saveBoardContents({
                boardId: editData.boardId,
                contents: {
                    ...editData,
                    channelId: selectBoard.channelType === 'BOARD_DIVC2' ? selectReport : editData.channelId,
                    boardId: null,
                    depth: 0,
                    indent: 0,
                },
                files: uploadFiles,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`${match.path}/${body.boardId}/${body.boardSeq}`);
                        dispatch(getJpodNotice());
                        dispatch(getBoardContents({ boardId: body.boardId, boardSeq: body.boardSeq }));
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

    // 수정 버튼 클릭 철.
    const handleClickUpdateButton = () => {
        if (checkValidation()) {
            return;
        }

        delete editData.regInfo;
        delete editData.modInfo;

        dispatch(
            updateBoardContents({
                boardId: boardId.current,
                boardSeq: boardSeq.current,
                contents: {
                    ...editData,
                    boardId: null,
                    channelId: selectBoard.channelType === 'BOARD_DIVC2' ? selectReport : editData.channelId,
                    depth: 0,
                    indent: 0,
                },
                files: uploadFiles,
                callback: ({ header: { success, message }, body }) => {
                    console.log(body);
                    if (success === true) {
                        toast.success(message);
                        history.push(`${match.path}/${body.boardId}/${body.boardSeq}`);
                        dispatch(getJpodNotice());
                        dispatch(getBoardContents({ boardId: body.boardId, boardSeq: body.boardSeq }));
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

    // 취소 버튼 처리.
    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
    };

    // 삭제 버튼 클릭 처리.
    const handleClickDeleteButton = () => {
        dispatch(
            deleteBoardContents({
                boardId: boardId.current,
                boardSeq: boardSeq.current,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`${match.path}`);
                        dispatch(getJpodNotice());
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

    // 답글 등록 버튼 클릭 처리.
    const handleClickReplayButton = () => {
        history.push(`${match.path}/${boardId.current}/${boardSeq.current}/reply`);
    };

    // 답변 버튼 저장 클릭 처리.
    const handleClickReplaySaveButton = () => {
        dispatch(
            saveBoardReply({
                boardId: boardId.current,
                parentBoardSeq: parentBoardSeq.current,
                boardSeq: boardSeq.current,
                contents: {
                    ...replyEditData,
                    boardId: null,
                    depth: 0,
                    indent: 0,
                    ordNo: editData.ordNo,
                    channelId: editData.channelId,
                    titlePrefix1: editData.titlePrefix1,
                    titlePrefix2: editData.titlePrefix2,
                    addr: editData.addr,
                },
                files: { attachFile: [] },
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`${match.path}/${body.boardId}/${body.parentBoardSeq}/reply/${body.boardSeq}`);
                        dispatch(getJpodNotice());
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

    // 답변 취소 버튼 클릭 처리.
    const handleClickReplayCancleButton = () => {
        if (noticeInfo.boardSeq === null) {
            history.push(`${match.path}`);
        } else {
            history.push(`${match.path}/${boardId.current}/${boardSeq.current}`);
            dispatch(getBoardContents({ boardId: boardId.current, boardSeq: boardSeq.current }));
        }
    };

    // summernote 이미지 업로드 처리.
    const SummernoteImageUpload = (file) => {
        const formData = new FormData();
        formData.append('attachFile', file[0]);

        dispatch(
            uploadBoardContentImage({
                boardId: boardId.current,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        if (editState.mode === 'new' || editState.mode === 'modify') {
                            setEditData({
                                ...editData,
                                content: `${editData.content} <img src="${body}">`,
                            });
                        } else {
                            setReplyEditData({
                                ...replyEditData,
                                content: `${replyEditData.content} <img src="${body}">`,
                            });
                        }
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // body에 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    // 이미지 추가 처리.
    const handleChangeFileInput = (event) => {
        // 게시판 설정 확장자 체크.
        let extCheck = false;
        try {
            let tempFile = event.target.files[0].name.split('.');
            let tempFileExt = tempFile[1];

            if (selectBoard.allowFileExt.replace(/ /g, '').split(',').indexOf(tempFileExt) < 0) {
                messageBox.alert(`해당 게시판의 첨부 파일은 (${selectBoard.allowFileExt}) 만 등록 가능합니다.`, () => {});
            } else {
                extCheck = true;
            }
        } catch (e) {
            throw e;
        }

        if (!extCheck) return;

        if (uploadFiles.length + 1 > selectBoard.allowFileCnt) {
            messageBox.alert('해당 게시판의 첨부 파일 최대 건수는 2개 입니다.', () => {});
        } else {
            setUploadFiles([...uploadFiles, event.target.files[0]]);
        }
        fileinputRef.current.value = '';
    };

    // 이미지 리스트 클릭시 새텝
    const handleClickImageName = (element) => {
        const { file_url } = element;
        if (file_url) {
            var win = window.open(file_url, '_blank');
            win.focus();
        }
    };

    // 이미지 삭제 처리.
    const handleDeleteUploadFile = (stateIndex) => {
        setUploadFiles(uploadFiles.filter((e, i) => i !== stateIndex));
    };

    // 답변 데이터 변경시 스테이트 업데이트.
    const handleChangeReplyFormData = (e) => {
        const { name, value } = e.target;
        setReplyEditData({
            ...replyEditData,
            [name]: value,
        });
    };

    // url 이 변경 되었을 경우 처리. ( 에피소드 고유 번호 및 add )
    useEffect(() => {
        if (!isNaN(params.boardId) && boardId.current !== params.boardId) {
            boardId.current = params.boardId;
        }

        if (!isNaN(params.boardSeq) && boardSeq.current !== params.boardSeq) {
            boardSeq.current = params.boardSeq;
            setEditState({
                mode: 'modify',
                title: '게시글 수정',
            });
        } else if (history.location.pathname === `${match.path}/add` && boardSeq.current !== 'add') {
            boardSeq.current = 'add';
            resetEditData(); // 에디터 리셋.
            setEditState({
                mode: 'new',
                title: '게시글 등록',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // 등록, 수정, 답변 등록 에 따른 라우터 파라미터 처리.
    useEffect(() => {
        if (history.location.pathname === `${match.path}/${boardId.current}/${parentBoardSeq.current}/reply/${boardSeq.current}`) {
            setEditState({
                mode: 'reply',
                title: '답변 수정',
            });
        }

        if (history.location.pathname === `${match.path}/${boardId.current}/${boardSeq.current}/reply`) {
            parentBoardSeq.current = null;
            setReplyEditData({});
            setEditState({
                mode: 'reply',
                title: '답변 등록',
            });
        }

        if (history.location.pathname === `${match.path}/${boardId.current}/${boardSeq.current}`) {
            parentBoardSeq.current = null;
            setEditState({
                mode: 'modify',
                title: '게시글 수정',
            });
        }

        if (history.location.pathname === `${match.path}/${boardId.current}/add`) {
            parentBoardSeq.current = null;
            setEditData({});
            setEditContents(' ');
            setEditState({
                mode: 'new',
                title: '게시글 등록',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.location]);

    useEffect(() => {
        const setInfoData = (data) => {
            setEditData({
                attaches: data.attaches,
                boardId: data.boardId,
                boardSeq: data.boardSeq,
                channelId: data.channelId,
                content: data.content,
                declareCnt: data.declareCnt,
                decomCnt: data.decomCnt,
                delYn: data.delYn,
                depth: data.depth,
                indent: data.indent,
                ordNo: data.ordNo,
                parentBoardSeq: data.parentBoardSeq,
                regName: data.regName,
                title: data.title,
                titlePrefix1: data.titlePrefix1,
                titlePrefix2: data.titlePrefix2,
                regDt: data.regDt,
                modDt: data.modDt,
                editorYn: data.boardInfo && data.boardInfo.editorYn,
                regInfo: data.regDt && data.regDt.length > 16 ? `등록 일시: ${data.regDt.substr(0, 16)} ${data.regName}` : '',
                modInfo: data.modDt && data.modDt.length > 16 ? `등록 일시: ${data.modDt.substr(0, 16)} ${data.regName}` : '',
            });

            dispatch(changeSelectBoard(data.boardInfo));
        };

        // 정보 조회가 끝났을경우.
        if (loading !== undefined && loading === false) {
            setInfoData(noticeInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, noticeInfo]);

    // 답변 정보 업데이트시.
    useEffect(() => {
        setReplyEditData(noticereply);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noticereply]);

    // 라우터 및 에디드 상태가 답변일때 초기화 처리.
    useEffect(() => {
        resetEditData();
        if (editState.mode === 'reply' && history.location.pathname === `${match.path}/${boardId.current}/${boardSeq.current}/reply`) {
            setReplyEditData(initialReplyEditState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editState]);

    // 게시글 내용이 변경 되었을때. ( 수정및 확인.)
    useEffect(() => {
        setEditData({
            ...editData,
            content: editContents,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editContents]);

    // 답변내용이 변경 되었을떄. ( 수정및 확인.)
    useEffect(() => {
        setReplyEditData({
            ...replyEditData,
            content: replyEditContents,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [replyEditContents]);

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
                        if (editState.mode === 'new') {
                            return (
                                <Row className="justify-content-md-center text-center">
                                    <Col className="mp-0 pr-0">
                                        <Button variant="positive" onClick={() => handleClickContentsSaveButton()}>
                                            저장
                                        </Button>
                                    </Col>
                                    <Col className="mp-0 pr-0">
                                        <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                            취소
                                        </Button>
                                    </Col>
                                </Row>
                            );
                            // 하단 버튼 보기, 수정 일때.
                        } else if (editState.mode === 'modify') {
                            return (
                                <Row className="justify-content-md-center text-center">
                                    {selectBoard.answYn === 'Y' && (
                                        <Col className="mp-0 pr-0">
                                            <Button variant="negative" onClick={() => handleClickReplayButton()}>
                                                답변
                                            </Button>
                                        </Col>
                                    )}
                                    <Col className="mp-0 pr-0">
                                        <Button variant="positive" onClick={() => handleClickUpdateButton()}>
                                            수정
                                        </Button>
                                    </Col>
                                    <Col className="mp-0 pr-0">
                                        <Button variant="negative" onClick={() => handleClickDeleteButton()}>
                                            삭제
                                        </Button>
                                    </Col>
                                    <Col className="mp-0 pr-0">
                                        <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                            취소
                                        </Button>
                                    </Col>
                                </Row>
                            );
                            // 하단 버튼 답글 일때.
                        } else if (editState.mode === 'reply') {
                            return (
                                <Row className="justify-content-md-center text-center">
                                    <Col className="mp-0 pr-0">
                                        <Button variant="positive" onClick={() => handleClickReplaySaveButton()}>
                                            저장
                                        </Button>
                                    </Col>
                                    <Col className="mp-0 pr-0">
                                        <Button variant="negative" onClick={() => handleClickReplayCancleButton()}>
                                            취소
                                        </Button>
                                    </Col>
                                </Row>
                            );
                        }
                    })()}
                </>
            }
        >
            {(function () {
                if (editState.mode === 'new' || editState.mode === 'modify') {
                    // info
                    return (
                        <Form>
                            {editState.mode === 'modify' && (
                                <Form.Row>
                                    <Col xs={6} style={{ fontSize: '1px' }}>
                                        {`${editData.regInfo ? editData.regInfo : ''}`}
                                    </Col>
                                    <Col xs={6} style={{ fontSize: '1px' }}>
                                        {`${editData.modInfo ? editData.modInfo : ''}`}
                                    </Col>
                                </Form.Row>
                            )}
                            {/* 채널 선택. */}
                            <Form.Row className="mb-2">
                                <Col xs={6} className="p-0">
                                    <MokaInputLabel
                                        label="게시판 선택"
                                        as="select"
                                        id="boardId"
                                        name="boardId"
                                        value={editData.boardId}
                                        onChange={(e) => {
                                            if (e.target.value !== '') {
                                                const temeBoardId = e.target.value;
                                                const boardInfo = boardList.filter((e) => e.boardId === Number(temeBoardId));
                                                dispatch(changeSelectBoard(boardInfo[0]));
                                            }
                                            handleChangeFormData(e);
                                        }}
                                    >
                                        <option value="">게시판 전체</option>
                                        {boardList.map((item, index) => (
                                            <option key={index} value={item.boardId}>
                                                {item.boardName}
                                            </option>
                                        ))}
                                    </MokaInputLabel>
                                </Col>
                            </Form.Row>
                            <Form.Row className="mb-2">
                                <Col xs={6} className="p-0">
                                    <MokaInputLabel as="select" label="순서" name="ordNo" id="ordNo" value={editData.ordNo} onChange={(e) => handleChangeFormData(e)}>
                                        <option value="">선택</option>
                                        {selectItem.orderType.map((item, index) => (
                                            <option key={index} value={item.value}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </MokaInputLabel>
                                </Col>
                            </Form.Row>
                            {(function () {
                                // 게시판 등록시 채널을 기자로 선택 했을경우 기자 리스트를 보여줘야 하는데
                                // 기자 리스트가 너무 많기 떄문에 검색기능을 할수 있게 MokaAutocomplete 를 사용
                                if (selectBoard.channelType === 'BOARD_DIVC2' && channelList) {
                                    return (
                                        <>
                                            {/* <Form.Row className="mb-2">
                                                <Col xs={2.5} className="p-0 pt-2">
                                                    <MokaInputLabel as="none" label="기자명"></MokaInputLabel>
                                                </Col>
                                                <MokaAutocomplete
                                                    options={channalList}
                                                    closeMenuOnSelect={true}
                                                    searchIcon={true}
                                                    // value={editData.channelId}
                                                    value={1001}
                                                    onChange={(e) => {
                                                        setSelectReport(e);
                                                    }}
                                                />
                                            </Form.Row> */}

                                            <BoardRepoterSelect
                                                ChannalList={channelList}
                                                SelectValue={selectReport}
                                                OnChange={(e) => {
                                                    setSelectReport(e.value);
                                                }}
                                            />
                                        </>
                                    );
                                } else {
                                    // 게시판 등록시 기자명 이외에는 기본 select box를 사용.
                                    if (channelList.length > 0) {
                                        return (
                                            <Form.Row className="mb-2">
                                                <Col xs={6} className="p-0">
                                                    <MokaInputLabel
                                                        as="select"
                                                        label="채널명"
                                                        name="channelId"
                                                        id="channelId"
                                                        value={editData.channelId}
                                                        onChange={(e) => handleChangeFormData(e)}
                                                    >
                                                        <option value="">선택</option>
                                                        {channelList.map((item, index) => (
                                                            <option key={index} value={item.value}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </MokaInputLabel>
                                                </Col>
                                            </Form.Row>
                                        );
                                    }
                                }
                            })()}
                            {/* 게시판 등록시 말머리1과 말머리2를 입력했을 경우 말머리1를 선택 할수 있게 */}
                            {(selectBoard.titlePrefix1 !== null || selectBoard.titlePrefix2 !== null) && (
                                <Form.Row className="mb-2">
                                    {/* 말머리1 */}
                                    {selectBoard.titlePrefix1 !== null && (
                                        <Col xs={6} className="p-0 pr-20">
                                            <MokaInputLabel
                                                as="select"
                                                label="말머리1"
                                                name="titlePrefix1"
                                                id="titlePrefix1"
                                                value={editData.titlePrefix1}
                                                onChange={(e) => handleChangeFormData(e)}
                                            >
                                                <option value="">선택</option>
                                                <option value={selectBoard.titlePrefix1}>{selectBoard.titlePrefix1}</option>
                                            </MokaInputLabel>
                                        </Col>
                                    )}

                                    {/* 말머리2*/}
                                    {selectBoard.titlePrefix2 !== null && (
                                        <Col xs={6} className="p-0 pl-20">
                                            <MokaInputLabel
                                                as="select"
                                                label="말머리2"
                                                name="titlePrefix2"
                                                id="titlePrefix2"
                                                value={editData.titlePrefix2}
                                                onChange={(e) => handleChangeFormData(e)}
                                            >
                                                <option value="">선택</option>
                                                <option value={selectBoard.titlePrefix2}>{selectBoard.titlePrefix2}</option>
                                            </MokaInputLabel>
                                        </Col>
                                    )}
                                </Form.Row>
                            )}
                            {/* 주소 */}
                            {/* 2021-01-06 14:35 추후 논의로 결정하기로. */}
                            {/* <Form.Row className="mb-2">
                                <Col className="p-0">
                                    <MokaInputLabel
                                        label="주소"
                                        className="mb-0"
                                        id="addr"
                                        name="addr"
                                        placeholder={'주소'}
                                        value={editData.addr}
                                        onChange={(e) => handleChangeFormData(e)}
                                    />
                                </Col>
                            </Form.Row> */}
                            {/* 제목 */}
                            <Form.Row className="mb-2">
                                <Col className="p-0">
                                    <MokaInput
                                        className="mb-0"
                                        id="title"
                                        name="title"
                                        placeholder={'제목을 입력해 주세요.'}
                                        value={editData.title}
                                        onChange={(e) => handleChangeFormData(e)}
                                    />
                                </Col>
                            </Form.Row>
                            {/* 내용 */}
                            {(function () {
                                // 게시판 등록시 에디터 사용 유무로 본문은 에디터로 보여 줍니다.
                                if (selectBoard.editorYn === 'N' && editState) {
                                    return (
                                        <Form.Row className="mb-2">
                                            <Col className="p-0">
                                                <MokaInputLabel
                                                    as="textarea"
                                                    className="mb-2"
                                                    inputClassName="resize-none"
                                                    inputProps={{ rows: 6 }}
                                                    id="content"
                                                    name="content"
                                                    value={editData.content}
                                                    onChange={(e) => setEditContents(e.target.value)}
                                                />
                                            </Col>
                                        </Form.Row>
                                    );
                                } else {
                                    // 에디터 설정을 안했을 경우는 textarea 로 보여줍니다.
                                    return (
                                        <Form.Row className="mb-2">
                                            <Col className="p-0">
                                                <BoardsSummernote
                                                    contentValue={editData.content}
                                                    editChange={(value) => {
                                                        setEditContents(value);
                                                    }}
                                                    editImageUpload={(e) => SummernoteImageUpload(e)}
                                                />
                                            </Col>
                                        </Form.Row>
                                    );
                                }
                            })()}
                            <hr className="divider" />
                            {(function () {
                                // 게시판 등롱시 파일 업로드 활성화 선택시
                                if (selectBoard.fileYn === 'Y') {
                                    return (
                                        <>
                                            <Form.Row>
                                                <Col xs={4} className="p-0">
                                                    <MokaInputLabel label={`첨부파일`} as="none" className="mb-2" />
                                                </Col>
                                                <Col xs={8} className="p-0 text-right">
                                                    <div className="file btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
                                                        등록
                                                        <input
                                                            type="file"
                                                            name="file"
                                                            ref={fileinputRef}
                                                            // onClick={(e) => (fileinputRef.current = e)}
                                                            onChange={(e) => handleChangeFileInput(e)}
                                                            style={{
                                                                position: 'absolute',
                                                                fontSize: '50px',
                                                                opacity: '0',
                                                                right: '0',
                                                                top: '0',
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Form.Row>
                                            <hr />
                                            {uploadFiles.map((element, index) => {
                                                return (
                                                    <Form.Row className="mb-0 pt-1" key={index}>
                                                        <Form.Row className="w-100" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                                                            <Col xs={11} className="w-100 h-100 d-flex align-items-center justify-content-start">
                                                                <div onClick={() => handleClickImageName(element)}>{element.name}</div>
                                                            </Col>
                                                            <Col>
                                                                <MokaTableEditCancleButton onClick={() => handleDeleteUploadFile(index)} />
                                                            </Col>
                                                        </Form.Row>
                                                    </Form.Row>
                                                );
                                            })}
                                        </>
                                    );
                                }
                            })()}
                        </Form>
                    );
                } else if (editState.mode === 'reply') {
                    // 대답.
                    return (
                        <Form>
                            <Form.Row className="mb-2">
                                <Col className="p-0">
                                    <MokaInputLabel
                                        label="제목"
                                        labelWidth={80}
                                        className="mb-0"
                                        id="Rtitle"
                                        name="title"
                                        value={replyEditData.title}
                                        onChange={(e) => handleChangeReplyFormData(e)}
                                    />
                                </Col>
                            </Form.Row>
                            {/* 내용 */}
                            {(function () {
                                if (editState && selectBoard.editorYn === 'N') {
                                    // 에디터 설정을 안했을 경우는 textarea 로 보여줍니다.
                                    return (
                                        <Form.Row className="mb-2">
                                            <Col className="p-0">
                                                <MokaInputLabel
                                                    as="textarea"
                                                    className="mb-2"
                                                    inputClassName="resize-none"
                                                    inputProps={{ rows: 6 }}
                                                    id="Rcontent"
                                                    name="content"
                                                    value={replyEditData.content}
                                                    onChange={(e) => setReplyEditContents(e.target.value)}
                                                />
                                            </Col>
                                        </Form.Row>
                                    );
                                } else {
                                    // 게시판 등록시 에디터 사용 유무로 본문은 에디터로 보여 줍니다.
                                    return (
                                        <Form.Row className="mb-2">
                                            <Suspense>
                                                <Col>
                                                    <BoardsSummernote
                                                        contentValue={replyEditData.content}
                                                        editChange={(value) => setReplyEditContents(value)}
                                                        editImageUpload={(e) => SummernoteImageUpload(e)}
                                                    />
                                                </Col>
                                            </Suspense>
                                        </Form.Row>
                                    );
                                }
                            })()}

                            <Form.Row>
                                <Col xs={7} className="p-0">
                                    <MokaInputLabel
                                        label="등록자"
                                        labelWidth={80}
                                        id="regName"
                                        name="regName"
                                        value={replyEditData.regName}
                                        onChange={(e) => handleChangeReplyFormData(e)}
                                    />
                                </Col>
                            </Form.Row>
                        </Form>
                    );
                }
            })()}
        </MokaCard>
    );
};

// 에디트 상태 및 에디트 타이틀 명.
const initialEditState = {
    mode: 'new',
    title: '게시글 등록',
};

// 기본 답변 버튼 눌렀을 경우 내용.
const initialReplyEditState = {
    title: 're: ',
    content: '',
};

export default NoticeEdit;
