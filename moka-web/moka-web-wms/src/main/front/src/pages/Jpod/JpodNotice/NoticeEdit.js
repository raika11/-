import React, { useState, useEffect, useRef } from 'react';
import { MokaCard, MokaInputLabel } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import BoardsSummernote from '@pages/Boards/BoardsList/BoardsEdit/BoardsSummernote';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import toast, { messageBox } from '@utils/toastUtil';

import { initialState as boardInitialState, saveBoardContents, uploadBoardContentImage, updateBoardContents, deleteBoardContents } from '@store/board'; // 게시판 initial 데이터.
import { getBoardContents, getJpodNotice, clearBoardContents, GET_BOARD_CONTENTS } from '@store/jpod';

const NoticeEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const selectBoardId = useRef(null);
    const selectBoardSeq = useRef(null);

    const [editData, setEditData] = useState(boardInitialState.listmenu.contents.info); // 게시글 정보가 저장되는 state
    const [editContents, setEditContents] = useState(''); // 게시판 본문 ( summernote, textarea)
    const [editTitle, setEditTitle] = useState(null);
    const [channalLists, setChannalLists] = useState([]); // 채널 리스트
    const [BoardLists, setBoardLists] = useState([]); // 채널 리스트

    const { noticeInfo, channelList, boardList, loading } = useSelector((store) => ({
        channelList: store.jpod.jpodNotice.channelList,
        boardList: store.jpod.jpodNotice.boardList,
        noticeInfo: store.jpod.jpodNotice.noticeInfo,
        loading: store.loading[GET_BOARD_CONTENTS],
    }));

    const resetEditData = () => {
        setEditData(boardInitialState.listmenu.contents.info);
        dispatch(clearBoardContents());
    };

    const setEditor = (boardid) => {
        const selectBoard = boardList.filter((e) => e.boardId === Number(boardid));

        setEditData({
            ...editData,
            editorYn: selectBoard[0].editorYn,
        });
    };

    // 게시글 데이터 변경시 스테이트 업데이트.
    const handleChangeEditData = (e) => {
        const { name, value } = e.target;
        if (name === 'boardId') {
            setEditor(value);
        }
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
    };

    const handleClickSaveButton = () => {
        const contents = {
            ...editData,
            ordNo: 9,
            boardId: null,
            depth: 0,
            indent: 0,
        };

        delete contents.regInfo;
        delete contents.modInfo;

        dispatch(
            saveBoardContents({
                boardId: editData.boardId,
                contents: contents,
                files: [],
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

    const handleClickUpdateButton = () => {
        const contents = {
            content: editData.content,
            depth: editData.depth,
            indent: editData.indent,
            ordNo: editData.ordNo,
            title: editData.title,
            channelId: editData.channelId,
        };

        dispatch(
            updateBoardContents({
                boardId: editData.boardId,
                boardSeq: editData.boardSeq,
                contents: contents,
                files: [],
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

    // 게시글 삭제 버튼 클릭.
    const handleClickDeleteButton = () => {
        dispatch(
            deleteBoardContents({
                boardId: editData.boardId,
                boardSeq: editData.boardSeq,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        history.push(`${match.path}`);
                        resetEditData();
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

    // summernote 이미지 업로드 처리.
    const SummernoteImageUpload = (file) => {
        const formData = new FormData();
        formData.append('attachFile', file[0]);

        dispatch(
            uploadBoardContentImage({
                boardId: editData.boardId,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        setEditData({
                            ...editData,
                            content: `${editData.content} <img src="${body}">`,
                        });
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

    // url 이 변경 되었을 경우 처리. ( 에피소드 고유 번호 및 add )
    useEffect(() => {
        const { boardId, boardSeq } = params;
        console.log(boardSeq);
        if (!isNaN(boardId) && selectBoardId.current !== boardId) {
            selectBoardId.current = boardId;
        }

        if (!isNaN(boardSeq) && selectBoardSeq.current !== boardSeq) {
            selectBoardSeq.current = boardSeq;
            dispatch(getBoardContents({ boardId: selectBoardId.current, boardSeq: boardSeq }));
            setEditTitle(null);
        } else if (history.location.pathname === `${match.path}/add` && selectBoardSeq.current !== 'add') {
            selectBoardSeq.current = 'add';
            resetEditData();
            setEditTitle('add');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // 게시글 내용이 변경 되었을때. ( 수정및 확인.)
    useEffect(() => {
        setEditData({
            ...editData,
            content: editContents,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editContents]);

    // 검색 및 본문에 작성시 필요한 J팟 채널 목록 설정.
    useEffect(() => {
        setChannalLists(channelList);
    }, [channelList]);

    // j팟 게시판 리스트 설정.
    useEffect(() => {
        setBoardLists(boardList);
    }, [boardList]);

    useEffect(() => {
        if (noticeInfo !== boardInitialState.listmenu.contents.info) {
            setEditData({
                ...editData,
                editorYn: noticeInfo && noticeInfo.boardInfo && noticeInfo.boardInfo.editorYn,
                regInfo: noticeInfo && noticeInfo.regDt && noticeInfo.regDt.length > 16 ? `등록 일시: ${noticeInfo.regDt.substr(0, 16)} ${noticeInfo.regName}` : '',
                modInfo: noticeInfo && noticeInfo.modDt && noticeInfo.modDt.length > 16 ? `등록 일시: ${noticeInfo.modDt.substr(0, 16)} ${noticeInfo.regName}` : '',
                ...noticeInfo,
            });

            setEditContents(noticeInfo.contents);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noticeInfo]);

    return (
        <MokaCard
            className="overflow-hidden flex-fill"
            title={`게시글 ${editTitle === 'add' ? '등록' : '정보'}`}
            titleClassName="mb-0"
            loading={loading}
            width={750}
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {(function () {
                        if (editTitle === 'add') {
                            return (
                                <Row className="justify-content-md-center text-center">
                                    <Col className="mp-0 pr-0">
                                        <Button variant="positive" onClick={() => handleClickSaveButton()}>
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
                        } else {
                            return (
                                <Row className="justify-content-md-center text-center">
                                    <Col className="mp-0 pr-0">
                                        <Button variant="positive" onClick={() => handleClickUpdateButton()}>
                                            수정
                                        </Button>
                                    </Col>
                                    <Col className="mp-0 pr-0">
                                        <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                            취소
                                        </Button>
                                    </Col>
                                    <Col className="mp-0 pr-0">
                                        <Button variant="negative" onClick={() => handleClickDeleteButton()}>
                                            삭제
                                        </Button>
                                    </Col>
                                </Row>
                            );
                        }
                    })()}
                </>
            }
        >
            <Form className="mb-gutter">
                {editTitle !== 'add' && (
                    <Form.Row>
                        <Form.Label style={{ width: 90, minWidth: 90, marginRight: 12 }}></Form.Label>
                        <Col xs={5} style={{ fontSize: '4px' }}>
                            {`${editData.regInfo && editData.regInfo !== undefined ? editData.regInfo : ''}`}
                        </Col>
                        <Col xs={5} style={{ fontSize: '4px' }}>
                            {`${editData.modInfo && editData.modInfo !== undefined ? editData.modInfo : ''}`}
                        </Col>
                    </Form.Row>
                )}
                {/* 채널 선택. */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="게시판 선택"
                            as="select"
                            id="boardId"
                            name="boardId"
                            labelWidth={90}
                            value={editData.boardId}
                            onChange={(e) => handleChangeEditData(e)}
                        >
                            <option value="">게시판 전체</option>
                            {BoardLists.map((item, index) => (
                                <option key={index} value={item.boardId}>
                                    {item.boardName}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                {/* 채널 선택. */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="채널명"
                            as="select"
                            id="channelId"
                            name="channelId"
                            labelWidth={90}
                            value={editData.channelId}
                            onChange={(e) => handleChangeEditData(e)}
                        >
                            <option value="">채널 전체</option>
                            {channalLists.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                {/* 에피소드 명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        className="overflow-hidden flex-fill mb-0"
                        id="title"
                        name="title"
                        placeholder="제목을 입력해 주세요."
                        value={editData.title}
                        onChange={(e) => handleChangeEditData(e)}
                    />
                </Form.Row>

                {(function () {
                    // 게시판 등록시 에디터 사용 유무로 본문은 에디터로 보여 줍니다.
                    // console.log(editData && editData.editorYn && editData.editorYn === 'Y');
                    // if ((loading === false && editData && editData.editorYn !== 'N' && editData.editorYn === 'Y') === true) {
                    if (editData.editorYn === 'N') {
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
                                        value={editData.content}
                                        onChange={(e) => setEditContents(e.target.value)}
                                    />
                                </Col>
                            </Form.Row>
                        );
                    } else {
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

                {editTitle !== 'add' && (
                    <Form.Row>
                        <MokaInputLabel
                            label="조회수"
                            labelWidth={90}
                            inputProps={{ plaintext: true, readOnly: true }}
                            value={editData.viewCnt === 0 ? `0` : editData.viewCnt}
                            name=""
                            className="overflow-hidden flex-fill mb-0"
                            labelClassName="ml-0"
                        />
                    </Form.Row>
                )}
            </Form>
        </MokaCard>
    );
};

export default NoticeEdit;
