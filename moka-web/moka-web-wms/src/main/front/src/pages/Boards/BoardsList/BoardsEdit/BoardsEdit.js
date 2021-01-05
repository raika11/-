import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MokaCard, MokaInputLabel, MokaInput, MokaTableEditCancleButton, MokaAutocomplete } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { selectItem } from '@pages/Boards/BoardConst';
import { unescapeHtml } from '@utils/convertUtil';
import {
    initialState,
    getListmenuContentsInfo,
    clearListmenuContentsInfo,
    getBoardChannelList,
    saveBoardContents,
    deleteBoardContents,
    updateBoardContents,
    saveBoardReply,
    uploadBoardContentImage,
    getListmenuContentsList,
} from '@store/board';
import ReactSummernote from 'react-summernote';
import 'react-summernote/lang/summernote-ko-KR';

const BoardsEdit = () => {
    const editInitData = initialState.listmenu.contents;
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const boardId = useRef(null);
    const boardSeq = useRef(null);
    const parentBoardSeq = useRef(null);

    // 공통 구분값 URL
    const { pagePathName, contentsinfo, contentsreply, selectboard } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        channel_list: store.board.channel_list,
        contentsinfo: store.board.listmenu.contents.info,
        contentsreply: store.board.listmenu.contents.reply,
        selectboard: store.board.listmenu.selectboard,
    }));

    const [editState, setEditState] = useState(initialEditState);
    const [editData, setEditData] = useState(editInitData.info);
    const [replyEditData, setReplyEditData] = useState(editInitData.reply);
    const [channalList, setChannalList] = useState([]);
    const [selectReport, setSelectReport] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);

    const editContent = useRef(null); // 게시글 본문
    const editReplyContent = useRef(null); // 답변글 본문

    let fileinputRef = useRef(null);

    const basicStateReset = () => {
        setUploadFiles([]);
        setUploadFiles([]);
        editContent.current = null;
        editReplyContent.current = null;
    };

    // Summernote 컴포넌트 로딩후에 setEditData와 스테이트 공유가 되지 않아서 게시글 내용은 useRef 로 저장후
    // 저장버튼이나 수정버튼 클릭시 formData 에 데이터를 조합 하는 방식으로 변경.
    const handleChangeEditContent = useCallback(
        (e) => {
            editContent.current = e;
            if (selectboard.editorYn !== 'Y') {
                setEditData({
                    ...editData,
                    content: editContent.current,
                });
            }
        },
        [editData, selectboard.editorYn],
    );

    // 답변 본문 처리.
    const handleChangeReplyEditContent = useCallback(
        (e) => {
            editReplyContent.current = e;
            if (selectboard.editorYn !== 'Y') {
                setReplyEditData({
                    ...replyEditData,
                    content: e,
                });
            }
        },
        [replyEditData, selectboard.editorYn],
    );

    // 게시글 데이터 변경시 스테이트 업데이트.
    const handleChangeFormData = useCallback(
        (e) => {
            const { name, value } = e.target;
            setEditData({
                ...editData,
                content: editContent.current,
                [name]: value,
            });
        },
        [editData],
    );

    // 답변 데이터 변경시 스테이트 업데이트.
    const handleChangeReplyFormData = (e) => {
        const { name, value } = e.target;
        setReplyEditData({
            ...replyEditData,
            [name]: value,
        });
    };

    // 답변 버튼 클릭.
    const handleClickReplayButton = () => {
        history.push(`/${pagePathName}/${boardId.current}/${boardSeq.current}/reply`);
    };

    // 답변 취소 버튼 클릭.
    const handleClickReplayCancleButton = () => {
        if (contentsinfo.boardSeq === null) {
            history.push(`/${pagePathName}/${boardId.current}`);
        } else {
            history.push(`/${pagePathName}/${boardId.current}/${boardSeq.current}`);
        }
    };

    // 게시글 취소 버튼 클릭.
    const handleClickCancleButton = () => {
        dispatch(clearListmenuContentsInfo());
        history.push(`/${pagePathName}/${boardId.current}`);
    };

    // 게시글 삭제 버튼 클릭.
    const handleClickDeleteButton = () => {
        dispatch(
            deleteBoardContents({
                boardId: boardId.current,
                boardSeq: boardSeq.current,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`/${pagePathName}/${boardId.current}`);
                        dispatch(getListmenuContentsList({ boardId: boardId.current }));
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

    // 게시글 등록 저장 버튼 클릭.
    const handleClickContentsSaveButton = () => {
        dispatch(
            saveBoardContents({
                boardId: boardId.current,
                contents: {
                    ...editData,
                    channelId: selectboard.channelType === 'BOARD_DIVC2' ? selectReport.value : editData.channelId,
                    boardId: null,
                    depth: 0,
                    indent: 0,
                    content: editContent.current,
                },
                files: uploadFiles,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`/${pagePathName}/${boardId.current}/${body.boardSeq}`);
                        dispatch(getListmenuContentsList({ boardId: boardId.current }));
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
        dispatch(
            updateBoardContents({
                boardId: boardId.current,
                boardSeq: boardSeq.current,
                contents: {
                    ...editData,
                    boardId: null,
                    depth: 0,
                    indent: 0,
                    content: editContent.current,
                },
                files: uploadFiles,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { boardSeq } = body;
                        history.push(`/${pagePathName}/${boardId.current}/${boardSeq}`);
                        dispatch(getListmenuContentsList({ boardId: boardId.current }));
                        dispatch(getListmenuContentsInfo({ boardId: boardId.current, boardSeq: boardSeq }));
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

    // 답변 저장 버튼 클릭.
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
                    content: editReplyContent.current === null ? editReplyContent.current : editReplyContent.current,
                },
                files: { attachFile: [] },
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`/${pagePathName}/${boardId.current}/${body.parentBoardSeq}/reply/${body.boardSeq}`);
                        dispatch(getListmenuContentsList({ boardId: boardId.current }));
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

    // useRef 현재 선택된 게시판, 게시글 정보 설정.
    useEffect(() => {
        if (!isNaN(Number(params.boardId)) && boardId.current !== params.boardId) {
            boardId.current = params.boardId;
        }

        if (!isNaN(Number(params.boardSeq)) && boardSeq.current !== params.boardSeq) {
            boardSeq.current = params.boardSeq;
            if (boardId.current && boardSeq.current) {
                setEditState({
                    mode: 'modify',
                    title: '게시글 수정',
                });
                dispatch(getListmenuContentsInfo({ boardId: boardId.current, boardSeq: boardSeq.current }));
            }
        }

        if (!isNaN(Number(params.parentBoardSeq)) && parentBoardSeq.current !== params.parentBoardSeq) {
            parentBoardSeq.current = params.parentBoardSeq;
        } else {
            parentBoardSeq.current = null;
        }
    }, [dispatch, params]);

    // 이미지 추가 처리.
    const handleChangeFileInput = (event) => {
        if (uploadFiles.length + 1 > selectboard.allowFileCnt) {
            messageBox.alert('해당 게시판의 첨부 파일 최대 건수는 2개 입니다.', () => {});
        } else {
            setUploadFiles([...uploadFiles, event.target.files[0]]);
        }
    };

    // 이미지 삭제 처리.
    const handleDeleteUploadFile = (stateIndex) => {
        setUploadFiles(uploadFiles.filter((e, i) => i !== stateIndex));
    };

    // 현재 선택된 게시판 채넣 옵션에 따라서 채널 리스트를 가지고 와서 설정.
    useEffect(() => {
        const getchannelTypeItem = (channelType) => {
            // dtlCd
            // BOARD_DIVC1 -> JPOD.
            // BOARD_DIVC2 -> 기자.
            dispatch(
                getBoardChannelList({
                    type: channelType,
                    callback: (element) => {
                        setChannalList(element);
                    },
                }),
            );
        };

        if (selectboard && selectboard.channelType) {
            getchannelTypeItem(selectboard.channelType);
        }
    }, [dispatch, selectboard]);

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
                        const tempContent = `${editContent.current} <img src="${body}">`;
                        editContent.current = tempContent;
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

    // 등록, 수정, 답변 등록 에 따른 라우터 파라미터 처리.
    useEffect(() => {
        basicStateReset();

        if (history.location.pathname === `/${pagePathName}/${boardId.current}/${parentBoardSeq.current}/reply/${boardSeq.current}`) {
            setEditState({
                mode: 'reply',
                title: '답변 수정',
            });
        }

        if (history.location.pathname === `/${pagePathName}/${boardId.current}/${boardSeq.current}/reply`) {
            setEditState({
                mode: 'reply',
                title: '답변 등록',
            });
        }

        if (history.location.pathname === `/${pagePathName}/${boardId.current}/${boardSeq.current}`) {
            setEditState({
                mode: 'modify',
                title: '게시글 수정',
            });
        }

        if (history.location.pathname === `/${pagePathName}/${boardId.current}/add`) {
            setEditState({
                mode: 'new',
                title: '게시글 등록',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.location]);

    // 게시글 정보 업데이트시
    useEffect(() => {
        setEditData(contentsinfo);

        if (contentsinfo.attaches.length > 0) {
            setUploadFiles(
                contentsinfo.attaches.map((e, i) => {
                    return {
                        seqNo: e.seqNo,
                        name: e.orgFileName,
                    };
                }),
            );
        }
        editContent.current = contentsinfo.content;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentsinfo]);

    // 답변 정보 업데이트시.
    useEffect(() => {
        setReplyEditData(contentsreply);

        editReplyContent.current = contentsreply.content;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentsreply]);

    useEffect(() => {
        if (editState.mode === 'reply' && history.location.pathname === `/${pagePathName}/${boardId.current}/${boardSeq.current}/reply`) {
            setReplyEditData(initialReplyEditState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editState]);

    return (
        <MokaCard
            width={550}
            title={`${editState.title}`}
            titleClassName="mb-0"
            loading={null}
            className="mr-gutter flex-fill"
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
                                    {selectboard.answYn === 'Y' && (
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
                        <Form className="mb-gutter">
                            {editState.mode === 'modify' && (
                                <Form.Row>
                                    <Col xs={6} style={{ fontSize: '1px' }}>
                                        {`등록 일시  2020-10-13 11:50 홍길동(hong12)`}
                                    </Col>
                                    <Col xs={6} style={{ fontSize: '1px' }}>
                                        {`수정 일시  2020-10-13 11:50 홍길동(hong12)`}
                                    </Col>
                                </Form.Row>
                            )}
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
                                if (selectboard.channelType === 'BOARD_DIVC2') {
                                    return (
                                        <Form.Row className="mb-2">
                                            <Col xs={2.5} className="p-0 pt-2">
                                                <MokaInputLabel as="none" label="기자명"></MokaInputLabel>
                                            </Col>
                                            <MokaAutocomplete
                                                options={channalList}
                                                closeMenuOnSelect={true}
                                                searchIcon={true}
                                                // value={editData.channelId}
                                                value={selectReport}
                                                onChange={(e) => {
                                                    setSelectReport(e);
                                                }}
                                            />
                                        </Form.Row>
                                    );
                                } else {
                                    // 게시판 등록시 기자명 이외에는 기본 select box를 사용.
                                    if (channalList.length > 0) {
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
                                                        {channalList.map((item, index) => (
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
                            {(selectboard.titlePrefix1 !== null || selectboard.titlePrefix2 !== null) && (
                                <Form.Row className="mb-2">
                                    {/* 말머리1 */}
                                    {selectboard.titlePrefix1 !== null && (
                                        <Col xs={6} className="p-0">
                                            <MokaInputLabel
                                                as="select"
                                                label="말머리1"
                                                name="titlePrefix1"
                                                id="titlePrefix1"
                                                value={editData.titlePrefix1}
                                                onChange={(e) => handleChangeFormData(e)}
                                            >
                                                <option value="">선택</option>
                                                <option value={selectboard.titlePrefix1}>{selectboard.titlePrefix1}</option>
                                            </MokaInputLabel>
                                        </Col>
                                    )}

                                    {/* 말머리2*/}
                                    {selectboard.titlePrefix2 !== null && (
                                        <Col xs={6} className="p-0">
                                            <MokaInputLabel
                                                as="select"
                                                label="말머리2"
                                                name="titlePrefix2"
                                                id="titlePrefix2"
                                                value={editData.titlePrefix2}
                                                onChange={(e) => handleChangeFormData(e)}
                                            >
                                                <option value="">선택</option>
                                                <option value={selectboard.titlePrefix2}>{selectboard.titlePrefix2}</option>
                                            </MokaInputLabel>
                                        </Col>
                                    )}
                                </Form.Row>
                            )}
                            {/* 주소 */}
                            <Form.Row className="mb-2">
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
                            </Form.Row>
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
                                if (selectboard.editorYn === 'Y') {
                                    return (
                                        <Form.Row className="mb-2">
                                            <Col className="p-0">
                                                <div className="d-flex moka-summernote">
                                                    <ReactSummernote
                                                        value={editContent.current !== '' ? unescapeHtml(editContent.current) : editContent.current}
                                                        options={{
                                                            lang: 'ko-KR',
                                                            height: 250,
                                                            dialogsInBody: true,
                                                        }}
                                                        onChange={(value) => {
                                                            handleChangeEditContent(value);
                                                        }}
                                                        onImageUpload={(e) => {
                                                            SummernoteImageUpload(e);
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Form.Row>
                                    );
                                } else {
                                    // 에디터 설정을 안했을 경우는 textarea 로 보여줍니다.
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
                                                    value={editContent.current}
                                                    onChange={(e) => {
                                                        handleChangeEditContent(e.target.value);
                                                    }}
                                                />
                                            </Col>
                                        </Form.Row>
                                    );
                                }
                            })()}
                            <hr />
                            {(function () {
                                // 게시판 등롱시 파일 업로드 활성화 선택시
                                if (selectboard.fileYn === 'Y') {
                                    return (
                                        <>
                                            <Form.Row className="mb-2">
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
                                                                {element.name}
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
                        <Form className="mb-gutter">
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
                                // 게시판 등록시 에디터 사용 유무로 본문은 에디터로 보여 줍니다.
                                if (selectboard.editorYn === 'Y') {
                                    return (
                                        <Form.Row className="mb-2">
                                            <Col className="p-0">
                                                <div className="d-flex moka-summernote">
                                                    <ReactSummernote
                                                        value={editReplyContent.current !== null ? unescapeHtml(editReplyContent.current) : editReplyContent.current}
                                                        options={{
                                                            lang: 'ko-KR',
                                                            height: 250,
                                                            dialogsInBody: true,
                                                        }}
                                                        onChange={(value) => {
                                                            handleChangeReplyEditContent(value);
                                                        }}
                                                        onImageUpload={(e) => {
                                                            SummernoteImageUpload(e);
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Form.Row>
                                    );
                                } else {
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
                                                    value={editReplyContent.current}
                                                    onChange={(e) => handleChangeReplyEditContent(e.target.value)}
                                                />
                                            </Col>
                                        </Form.Row>
                                    );
                                }
                            })()}

                            <Form.Row className="mb-2">
                                <Col xs={7} className="p-0">
                                    <MokaInputLabel
                                        label="등록자"
                                        labelWidth={80}
                                        className="mb-0"
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

const initialEditState = {
    mode: 'new',
    title: '게시글 등록',
};
const initialReplyEditState = {
    title: 're: ',
    content: '',
};

export default BoardsEdit;
