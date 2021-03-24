import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { GET_BOARD_CONTENTS, getJpodNotice, getBoardContents } from '@store/jpod';
import { uploadBoardContentsImage, updateBoardContents, saveBoardContents, deleteBoardContents } from '@store/board';
import BoardRepoterSelect from '@pages/Boards/BoardsList/BoardsEdit/BoardRepoterSelect';
import BoardsSummernote from '@pages/Boards/BoardsList/BoardsEdit/BoardsSummernote';

/**
 * J팟 관리 - 공지 게시판 수정 / 등록
 */
const NoticeEdit = ({ match }) => {
    const history = useHistory();
    const { boardSeq } = useParams();
    const dispatch = useDispatch();

    const { noticeInfo, loading, selectBoard, channelList } = useSelector((store) => ({
        noticeInfo: store.jpod.jpodNotice.noticeInfo,
        channelList: store.jpod.jpodNotice.channelList,
        selectBoard: store.jpod.jpodNotice.selectBoard,
        loading: store.loading[GET_BOARD_CONTENTS],
    }));

    const [editData, setEditData] = useState({});
    const [selectReport, setSelectReport] = useState([]); // 기자 선택.
    // const [replyEditData, setReplyEditData] = useState({}); // 답변 정보가 저장 되는 state.

    const [editContents, setEditContents] = useState('');
    const [uploadFiles, setUploadFiles] = useState([]); // 등록 파일.
    let fileinputRef = useRef(null);

    const resetEditData = () => {
        setEditData({
            ordNo: 1, // 순서 설정 : 일반.
            boardId: selectBoard.boardId, // 게시판 ID 값.
        });
        setUploadFiles([]);
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
                boardId: editData.boardId,
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
                boardId: editData.boardId,
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

    // summernote 이미지 업로드 처리.
    const SummernoteImageUpload = (file) => {
        const formData = new FormData();
        formData.append('attachFile', file[0]);

        dispatch(
            uploadBoardContentsImage({
                boardId: editData.boardId,
                imageForm: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        setEditData({
                            ...editData,
                            content: `${editData.content} <img src="${body}">`,
                        });
                        // else {
                        //     setReplyEditData({
                        //         ...replyEditData,
                        //         content: `${replyEditData.content} <img src="${body}">`,
                        //     });
                        // }
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

    useEffect(() => {
        if (!boardSeq) {
            setEditData({});
            setEditContents(' ');
            resetEditData(); // 에디터 리셋.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardSeq]);

    useEffect(() => {
        if (loading && loading === false) {
            setEditData({
                ...noticeInfo,
                editorYn: noticeInfo.boardInfo && noticeInfo.boardInfo.editorYn,
                regInfo: noticeInfo.regDt && noticeInfo.regDt.length > 16 ? `등록 일시: ${noticeInfo.regDt.substr(0, 16)} ${noticeInfo.regName}(${noticeInfo.regId})` : '',
                modInfo: noticeInfo.modDt && noticeInfo.modDt.length > 16 ? `수정 일시: ${noticeInfo.modDt.substr(0, 16)} ${noticeInfo.regName}(${noticeInfo.regId})` : '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, noticeInfo]);

    useEffect(() => {
        // 게시글 내용이 변경 되었을때. (수정 및 확인)
        setEditData({
            ...editData,
            content: editContents,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editContents]);

    useEffect(() => {
        if (editData.boardId && boardSeq) {
            dispatch(getBoardContents({ boardId: editData.boardId, boardSeq: boardSeq }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectBoard.boardId) {
            setEditData({
                ...editData,
                ordNo: 1, // 순서 설정 : 일반.
                boardId: selectBoard.boardId, // 게시판 ID 값.
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectBoard]);

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
                    {boardSeq ? (
                        // 하단 버튼 보기, 수정 일때
                        <>
                            <Button variant="positive" className="mr-1" onClick={() => handleClickUpdateButton()}>
                                수정
                            </Button>
                            <Button variant="negative" className="mr-1" onClick={() => handleClickDeleteButton()}>
                                삭제
                            </Button>
                            <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                취소
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="positive" className="mr-1" onClick={() => handleClickContentsSaveButton()}>
                                저장
                            </Button>
                            <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                취소
                            </Button>
                        </>
                    )}
                </>
            }
        >
            <Form>
                {boardSeq && (
                    <Form.Row>
                        <Col xs={6} className="ft-12">
                            {`${editData.regInfo ? editData.regInfo : ''}`}
                        </Col>
                        <Col xs={6} className="ft-12">
                            {`${editData.modInfo ? editData.modInfo : ''}`}
                        </Col>
                    </Form.Row>
                )}
                {selectBoard.channelType === 'BOARD_DIVC2' && channelList && (
                    // 게시판 등록시 채널을 기자로 선택 했을경우 기자 리스트를 보여줘야 하는데 // 기자 리스트가 너무 많기 떄문에 검색기능을 할수 있게 MokaAutocomplete 를 사용
                    <>
                        <BoardRepoterSelect
                            ChannalList={channelList}
                            SelectValue={selectReport}
                            OnChange={(e) => {
                                setSelectReport(e.value);
                            }}
                        />
                    </>
                )}
                {channelList.length > 0 && (
                    // 게시판 등록시 기자명 이외에는 기본 select box를 사용.
                    <Form.Row className="mb-2">
                        <Col xs={6} className="p-0">
                            <MokaInputLabel as="select" label="채널명" name="channelId" id="channelId" value={editData.channelId} onChange={(e) => handleChangeFormData(e)}>
                                <option value="">선택</option>
                                {channelList.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </MokaInputLabel>
                        </Col>
                    </Form.Row>
                )}
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
                {selectBoard.editorYn === 'Y' ? (
                    // 게시판 등록시 에디터 사용 유무로 본문은 에디터로 보여 줍니다.
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <BoardsSummernote
                                contentValue={editData.content}
                                onChangeValue={(value) => {
                                    setEditContents(value);
                                }}
                                onImageUpload={(e) => SummernoteImageUpload(e)}
                            />
                        </Col>
                    </Form.Row>
                ) : (
                    // 에디터 설정을 안했을 경우는 textarea 로 보여줍니다.
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
                                onChange={(e) => handleChangeFormData(e)}
                            />
                        </Col>
                    </Form.Row>
                )}
            </Form>
        </MokaCard>
    );
};

export default NoticeEdit;
