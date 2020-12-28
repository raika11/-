import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem } from '@pages/Boards/BoardConst';
import { initialState, GET_SETMENU_BOARD_INFO, getBoardInfo, getSetmenuBoardsList, saveBoardInfo, deleteBoard } from '@store/boards';
import toast, { messageBox } from '@utils/toastUtil';

const BoardsEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const paramBoardId = useRef(null);
    const params = useParams();
    // 공통 구분값 URL
    const { pagePathName, boardinfo, loading } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        boardinfo: store.boards.setmenu.boardinfo,
        loading: store.loading[GET_SETMENU_BOARD_INFO],
    }));

    const [boardInfoData, setBoardInfoData] = useState(initialState.setmenu.boardinfo);

    const handleClickCancleButton = () => {
        history.push(`/${pagePathName}`);
    };

    const handleChangeInfoData = (e) => {
        const { name, value, checked } = e.target;
        if (e.target.type === 'checkbox') {
            setBoardInfoData({
                ...boardInfoData,
                [name]: checked === true ? 'Y' : 'N',
            });
        } else {
            setBoardInfoData({
                ...boardInfoData,
                [name]: value,
            });
        }
    };

    // 유효성
    const validate = (element) => {
        // 타입.
        if (element.boardType === '') {
            messageBox.alert('타입을 선택해 주세요.', () => {});
            return false;
        }

        // 게시판명
        if (element.boardName === '') {
            messageBox.alert('게시판명을 입력해 주세요.', () => {});
            return false;
        }

        // 게시판 설명
        if (element.boardDesc === '') {
            messageBox.alert('게시판 설명을 입력해주세요.', () => {});
            return false;
        }

        // 말머리1
        if (element.titlePrefix1 === '') {
            messageBox.alert('말머리1을 입력해주세요.', () => {});
            return false;
        }

        // 말머리2
        if (element.titlePrefix2 === '') {
            messageBox.alert('말머리2를 입력해주세요.', () => {});
            return false;
        }

        // 채널
        if (element.channelType === '') {
            messageBox.alert('채널을 선택해 주세요.', () => {});
            return false;
        }

        // 파일
        if (element.fileYn === 'Y') {
            // 개수
            if (element.allowFileCnt === '') {
                messageBox.alert('파일 개수를 입력해 주세요.', () => {});
                return false;
            }

            // 용량
            if (element.allowFileSize === '') {
                messageBox.alert('용량을 입력해 주세요.', () => {});
                return false;
            }

            // 확장자
            if (element.allowFileExt === '') {
                messageBox.alert('확장자를 입력해 주세요.', () => {});
                return false;
            }
        }

        return true;
    };

    // 저장 버튼.
    const handleClickSaveButton = () => {
        const boardId = boardInfoData.boardId;
        const type = boardId !== null ? 'update' : 'save';

        if (validate(boardInfoData)) {
            dispatch(
                saveBoardInfo({
                    type: type,
                    boardinfo: boardInfoData,
                    callback: ({ header: { success, message }, body }) => {
                        if (success === true) {
                            toast.success(message);
                            const { boardId } = body;
                            if (body.boardId) {
                                dispatch(getSetmenuBoardsList()); // 리스트를 다시 가지고 옴.
                                history.push(`/${pagePathName}/${boardId}`);
                            }
                        } else {
                            const { totalCnt, list } = body;
                            if (totalCnt > 0 && Array.isArray(list)) {
                                messageBox.alert(list[0].reason, () => {}); // 에러 메시지 확인.
                            } else {
                                messageBox.alert(message, () => {}); // 서버 메시지 확인.
                            }
                        }
                    },
                }),
            );
        }
    };

    const handleClickDeleteButton = () => {
        dispatch(
            deleteBoard({
                boardId: boardinfo.boardId,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        dispatch(getSetmenuBoardsList()); // 리스트를 다시 가지고 옴.
                        history.push(`/${pagePathName}`);
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            messageBox.alert(list[0].reason, () => {}); // 에러 메시지 확인.
                        } else {
                            messageBox.alert(message, () => {}); // 서버 메시지 확인.
                        }
                    }
                },
            }),
        );
    };

    useEffect(() => {
        const setParamBoardId = ({ boardId }) => {
            if (isNaN(boardId) === false && paramBoardId.current !== boardId) {
                paramBoardId.current = boardId;

                dispatch(getBoardInfo({ boardId: boardId }));
            } else if (boardId === 'add') {
                setBoardInfoData(initialState.setmenu.boardinfo);
            }
        };
        setParamBoardId(params);
    }, [dispatch, params]);

    useEffect(() => {
        setBoardInfoData(boardinfo);
    }, [boardinfo]);

    return (
        <MokaCard
            width={635}
            title={`게시판 ${true ? '정보' : '등록'}`}
            titleClassName="mb-0"
            loading={loading}
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-05' },
                { text: '삭제', variant: 'negative', onClick: () => handleClickDeleteButton(), className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: () => handleClickCancleButton(), className: 'mr-05' },
            ]}
        >
            <Form className="mb-gutter">
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            labelWidth={60}
                            className="mb-2"
                            label="사용"
                            inputProps={{ checked: boardInfoData.usedYn === 'Y' ? true : false }}
                            onChange={(e) => handleChangeInfoData(e)}
                            value={boardInfoData.usedYn}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label={`타입`}
                            as="select"
                            labelWidth={60}
                            onChange={(e) => handleChangeInfoData(e)}
                            name="boardType"
                            id="boardType"
                            value={boardInfoData.boardType}
                        >
                            <option hidden>선택</option>
                            {selectItem.boardType.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label="게시판명"
                            labelWidth={60}
                            className="mb-0"
                            id="boardName"
                            name="boardName"
                            placeholder={'게시판명'}
                            value={boardInfoData.boardName}
                            onChange={(e) => handleChangeInfoData(e)}
                            disabled={false}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label="게시판 설명"
                            labelWidth={60}
                            className="mb-0"
                            name="boardDesc"
                            id="boardDesc"
                            placeholder={'게시판 설명'}
                            value={boardInfoData.boardDesc}
                            onChange={(e) => handleChangeInfoData(e)}
                            disabled={false}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label="말머리1"
                            labelWidth={60}
                            className="mb-0"
                            id="titlePrefix1"
                            name="titlePrefix1"
                            value={boardInfoData.titlePrefix1}
                            onChange={(e) => handleChangeInfoData(e)}
                            disabled={false}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label="말머리2"
                            labelWidth={60}
                            className="mb-0"
                            id="titlePrefix2"
                            name="titlePrefix2"
                            value={boardInfoData.titlePrefix2}
                            onChange={(e) => handleChangeInfoData(e)}
                            disabled={false}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            labelWidth={60}
                            name="editorYn"
                            id="editorYn"
                            className="pr-2 mb-2"
                            label="에디터"
                            inputProps={{ checked: boardInfoData.editorYn === 'Y' ? true : false }}
                            onChange={(e) => handleChangeInfoData(e)}
                        />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="answYn"
                            id="answYn"
                            className="pl-1 pr-0 mb-2"
                            label="답변"
                            labelWidth={25}
                            inputProps={{ checked: boardInfoData.answYn === 'Y' ? true : false }}
                            onChange={(e) => handleChangeInfoData(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label={`채널`}
                            as="select"
                            labelWidth={60}
                            onChange={(e) => handleChangeInfoData(e)}
                            name="channelType"
                            id="channelType"
                            value={boardInfoData.channelType}
                        >
                            <option hidden>선택</option>
                            {selectItem.channelType.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.name}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={2} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            labelWidth={60}
                            name="fileYn"
                            id="fileYn"
                            className="pr-2"
                            label="파일"
                            inputProps={{ checked: boardInfoData.fileYn === 'Y' ? true : false }}
                            onChange={(e) => handleChangeInfoData(e)}
                        />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel
                            label="개수"
                            labelWidth={25}
                            className="mb-0 pl-2"
                            id="allowFileCnt"
                            name="allowFileCnt"
                            value={boardInfoData.allowFileCnt}
                            onChange={(e) => handleChangeInfoData(e)}
                        />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel
                            label="용량"
                            labelWidth={25}
                            className="mb-0"
                            id="allowFileSize"
                            name="allowFileSize"
                            placeholder={'용량(MB)'}
                            value={boardInfoData.allowFileSize}
                            onChange={(e) => handleChangeInfoData(e)}
                        />
                    </Col>
                    <Col xs={4}>
                        <MokaInputLabel
                            label="확장자"
                            labelWidth={40}
                            className="mb-0"
                            id="allowFileExt"
                            name="allowFileExt"
                            value={boardInfoData.allowFileExt}
                            onChange={(e) => handleChangeInfoData(e)}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default BoardsEdit;
