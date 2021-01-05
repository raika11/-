import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectItem } from '@pages/Boards/BoardConst';
import { initialState, GET_SETMENU_BOARD_INFO, getBoardInfo, getSetmenuBoardsList, saveBoardInfo, deleteBoard } from '@store/board';
import toast, { messageBox } from '@utils/toastUtil';

const BoardsEdit = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const paramBoardId = useRef(null);
    const params = useParams();
    // 공통 구분값 URL
    const { pagePathName, boardType: storeBoardType, boardinfo, loading, channeltype_list } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        boardType: store.board.boardType,
        boardinfo: store.board.setmenu.boardinfo,
        channeltype_list: store.board.channeltype_list,
        loading: store.loading[GET_SETMENU_BOARD_INFO],
    }));

    // 게시판 폼 필드값.
    const [boardInfoData, setBoardInfoData] = useState(initialState.setmenu.boardinfo);

    // 게시판 폼 필드 disabled 컨트롤.
    const [inputfieldDisabled, setInputfieldDisabled] = useState({
        allowFileCnt: false,
        allowFileSize: false,
        allowFileExt: false,
        receiveEmail: false,
        sendEmail: false,
        answLevel: false,
        replyLevel: false,
    });

    // 취소 버튼 클릭.
    const handleClickCancleButton = () => {
        history.push(`/${pagePathName}`);
    };

    // 폼 input 데이터 변경시
    const handleChangeInfoData = (e) => {
        let tempObject = {};
        const { name, value, checked } = e.target;

        // checkbox 값이 변경되면 연관 필드 값도 disabled 시켜줌.
        if (e.target.type === 'checkbox') {
            tempObject = {
                ...boardInfoData,
                [name]: checked === true ? 'Y' : 'N',
            };

            // 답변 checkbox 버튼
            if (name === 'answYn' && checked === false) {
                tempObject = {
                    ...tempObject,
                    answLevel: initialState.setmenu.boardinfo.answLevel,
                };
            }

            // 답글 checkbox 버튼
            if (name === 'replyYn' && checked === false) {
                tempObject = {
                    ...tempObject,
                    replyLevel: initialState.setmenu.boardinfo.replyLevel,
                };
            }

            // 이메일 수진 여부 checkbox 버튼
            if (name === 'emailReceiveYn' && checked === false) {
                tempObject = {
                    ...tempObject,
                    receiveEmail: initialState.setmenu.boardinfo.receiveEmail,
                };
            }

            // 이메일 발신 여부 checkbox 버튼
            if (name === 'emailSendYn' && checked === false) {
                tempObject = {
                    ...tempObject,
                    sendEmail: initialState.setmenu.boardinfo.sendEmail,
                };
            }

            // 파일 checkbox 버튼
            if (name === 'fileYn' && checked === false) {
                tempObject = {
                    ...tempObject,
                    allowFileCnt: initialState.setmenu.boardinfo.allowFileCnt,
                    allowFileSize: initialState.setmenu.boardinfo.allowFileSize,
                    allowFileExt: initialState.setmenu.boardinfo.allowFileExt,
                };
            }
        } else {
            tempObject = {
                ...boardInfoData,
                [name]: value,
            };
        }

        // 데이터 조합해서 스테이트 변경 처리.
        setBoardInfoData(tempObject);
    };

    // form 값 체크 어드민 페이지 일떄.
    const makeAdminFormData = () => {
        let returnFormData = {
            ...boardInfoData,
            boardType: storeBoardType,
        };

        // 파일 등록
        // 파일 등록 선택후 개수 입력 안했을때.
        if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileCnt) {
            return {
                state: false,
                message: '개수를 입력해 주세요.',
            };
        }

        // 파일 등록 선택후 용량 입력 안했을때.
        if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileSize) {
            return {
                state: false,
                message: '용량을 입력해 주세요.',
            };
        }

        // 파일 등록 선택후 확장자 입력 안했을때.
        if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileExt) {
            return {
                state: false,
                message: '확장자를 입력해 주세요.',
            };
        }

        return {
            state: true,
            data: returnFormData,
            message: '',
        };
    };

    // form 값 체크 서비스 페이지 일떄.
    const makeServiceFormData = () => {
        let returnFormData = {
            ...boardInfoData,
            boardType: storeBoardType,
        };

        // 답변 checkbox 를 true 로 선택후 관련 등급을 선택 안했을떄.
        if (boardInfoData.answYn === 'Y' && !boardInfoData.answLevel) {
            return {
                state: false,
                message: '답변 등급을 선택해 주세요.',
            };
        }

        // 댓글 checkbox 를 true 로 선택후 관련 등급을 선택 안했을떄.
        if (boardInfoData.replyYn === 'Y' && !boardInfoData.replyLevel) {
            return {
                state: false,
                message: '댓글 등급을 선택해 주세요.',
            };
        }

        // 이메일 수신여부 checkbox 를 true 로 선택후 이메일을 입력 안했을떄.
        if (boardInfoData.emailReceiveYn === 'Y' && !boardInfoData.receiveEmail) {
            return {
                state: false,
                message: '이메일을 입력해 주세요.',
            };
        }

        // 이메일 발신여부 checkbox 를 true 로 선택후 이메일을 입력 안했을떄.
        if (boardInfoData.emailSendYn === 'Y' && !boardInfoData.sendEmail) {
            return {
                state: false,
                message: '이메일을 입력해 주세요.',
            };
        }

        // 파일 checkbox 를 true 로 선택후 개수를 입력 안했을떄.
        if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileCnt) {
            return {
                state: false,
                message: '개수를 입력해 주세요.',
            };
        }

        // 파일 checkbox 를 true 로 선택후 용량를 입력 안했을떄.
        if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileSize) {
            return {
                state: false,
                message: '용량을 입력해 주세요.',
            };
        }

        // 파일 checkbox 를 true 로 선택후 확장자를 입력 안했을떄.
        if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileExt) {
            return {
                state: false,
                message: '확장자를 입력해 주세요.',
            };
        }

        // 입력 등급을 선택 안했을떄.
        if (!boardInfoData.insLevel) {
            return {
                state: false,
                message: '입력 등급을 선택해 주세요.',
            };
        }

        // 조회 등급을 선택 안했을떄.
        if (!boardInfoData.viewLevel) {
            return {
                state: false,
                message: '조회 등급을 선택해 주세요.',
            };
        }

        // 추천 항목을 선택 안했을떄.
        if (!boardInfoData.recomFlag) {
            return {
                state: false,
                message: '추천을 선택해 주세요.',
            };
        }

        return {
            state: true,
            data: returnFormData,
        };
    };

    // 저장 버튼.
    const handleClickSaveButton = () => {
        let tempData = initialState.setmenu.boardinfo; // 기본 init 데이터.
        let formData = {}; // 폼데이터.

        if (boardInfoData.boardName === '' || boardInfoData.boardName === null) {
            messageBox.alert('게시판 명을 입력해 주세요.', () => {});
            return false;
        }

        if (storeBoardType === 'S') {
            formData = makeServiceFormData();
        } else {
            formData = makeAdminFormData();
        }

        // form 체크 실패면 해당 메시지 얼럿.
        if (formData.state === false) {
            messageBox.alert(formData.message, () => {});
            return false;
        }

        const tempFormData = formData.data;

        // form 값을 체크후에 init 데이터와 조합.
        // null 처리를 하기 위해서 기존 init 데이터에 폼 체크 값을 추가 해줘서 api 에 보낼 데이터를 만듬.
        Object.keys(tempFormData).forEach((key) => {
            let value = tempFormData[key];

            if (value === '') {
                value = initialState.setmenu.boardinfo[key];
            }

            tempData = {
                ...tempData,
                [key]: value,
            };
        });

        // boardId 값이 없으면 등록 있으면 수정.
        let type;
        if (boardInfoData.boardId != null) {
            type = 'update';
        } else {
            type = 'save';
        }

        dispatch(
            saveBoardInfo({
                type: type,
                boardinfo: tempData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { boardId } = body;
                        if (body.boardId) {
                            // 리스트를 다시 가지고 옴.
                            dispatch(getSetmenuBoardsList());
                            // 게시판 정보 값도 다시 가지고 옴.
                            dispatch(getBoardInfo({ boardId: body.boardId }));
                            history.push(`/${pagePathName}/${boardId}`);
                        }
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
        return;
    };

    // 삭제 버튼 철.
    const handleClickDeleteButton = () => {
        messageBox.confirm('삭제 하시겠습니까?', () => {
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
        });
    };

    useEffect(() => {
        const setParamBoardId = ({ boardId }) => {
            // url 로 boardId 값이 변경 되면 해당 게시판 정보를 가지고 옴.
            if (isNaN(boardId) === false && paramBoardId.current !== boardId) {
                paramBoardId.current = boardId;

                dispatch(getBoardInfo({ boardId: boardId }));
                // url 에 add 일 경우는 게시판 정보 상태값을 초기화 한다.
            } else if (boardId === 'add') {
                setBoardInfoData(initialState.setmenu.boardinfo);
            }
        };
        setParamBoardId(params);
    }, [dispatch, params]);

    useEffect(() => {
        // url 이 변경 되거나 게시판 정보를 다시 가지고 오면 store 값을 읽어서 게시판 정보 스테이트를 변경 해준다.
        setBoardInfoData(boardinfo);
    }, [boardinfo]);

    // 게시판 정보 스테이트가 변경 되면 check 값을 확인해서 관련 input 을 disabled 해준다.
    useEffect(() => {
        setInputfieldDisabled({
            ...inputfieldDisabled,
            allowFileCnt: boardInfoData.fileYn !== 'Y',
            allowFileSize: boardInfoData.fileYn !== 'Y',
            allowFileExt: boardInfoData.fileYn !== 'Y',
            receiveEmail: boardInfoData.emailReceiveYn !== 'Y',
            sendEmail: boardInfoData.emailSendYn !== 'Y',
            answLevel: boardInfoData.answYn !== 'Y',
            replyLevel: boardInfoData.replyYn !== 'Y',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardInfoData]);

    return (
        <MokaCard
            width={635}
            title={`게시판 ${true ? '정보' : '등록'}`}
            titleClassName="mb-0"
            loading={loading}
            className="mr-gutter flex-fill"
            bodyClassName="d-flex flex-column"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-05' },
                { text: '삭제', variant: 'negative', onClick: () => handleClickDeleteButton(), className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: () => handleClickCancleButton(), className: 'mr-05' },
            ]}
        >
            <Form className="mb-gutter">
                {/* 사용 여부 */}
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

                {/* 타입 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label={`타입`} as="select" labelWidth={60} name="boardType" id="boardType" value={storeBoardType} onChange={(e) => handleChangeInfoData(e)}>
                            {selectItem.boardType
                                .filter((item) => item.value === storeBoardType)
                                .map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>

                {/* 게시판명 */}
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

                {/* 게시판 설명 */}
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

                {/* 말머리1 */}
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

                {/* 말머리2 */}
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

                {/* 에디터 */}
                <Form.Row className="mb-2">
                    {/* 에디터 */}
                    <Col xs={2.5} className="p-0">
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

                    {/* 답변 */}
                    <Col xs={2} className="p-0">
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

                    {storeBoardType === 'S' && (
                        <>
                            {/* 댓글 */}
                            <Col xs={2} className="p-0">
                                <MokaInputLabel
                                    as="switch"
                                    name="replyYn"
                                    id="replyYn"
                                    className="pl-1 pr-0 mb-2"
                                    label="댓글"
                                    labelWidth={25}
                                    inputProps={{ checked: boardInfoData.replyYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeInfoData(e)}
                                />
                            </Col>

                            {/* 신고 */}
                            <Col xs={2} className="p-0">
                                <MokaInputLabel
                                    as="switch"
                                    name="declareYn"
                                    id="declareYn"
                                    className="pl-1 pr-0 mb-2"
                                    label="신고"
                                    labelWidth={25}
                                    inputProps={{ checked: boardInfoData.declareYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeInfoData(e)}
                                />
                            </Col>

                            {/* 캡챠 */}
                            <Col xs={2} className="p-0">
                                <MokaInputLabel
                                    as="switch"
                                    name="captchaYn"
                                    id="captchaYn"
                                    className="pl-1 pr-0 mb-2"
                                    label="캡챠"
                                    labelWidth={25}
                                    inputProps={{ checked: boardInfoData.captchaYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeInfoData(e)}
                                />
                            </Col>
                        </>
                    )}
                </Form.Row>

                {storeBoardType === 'S' && (
                    <>
                        {/* 이메일 수신여부 */}
                        <Form.Row className="mb-2">
                            {/* 이메일 수신여부 */}
                            <Col xs={2.5} className="p-0">
                                <MokaInputLabel
                                    as="switch"
                                    labelWidth={60}
                                    name="emailReceiveYn"
                                    id="emailReceiveYn"
                                    className="pr-2 mb-2"
                                    label="이메일\n수신여부"
                                    inputProps={{ checked: boardInfoData.emailReceiveYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeInfoData(e)}
                                />
                            </Col>

                            {/* 이메일 */}
                            <Col className="p-0">
                                <MokaInputLabel
                                    label="이메일"
                                    labelWidth={40}
                                    className="mb-0 w-100"
                                    id="receiveEmail"
                                    name="receiveEmail"
                                    placeholder={'이메일'}
                                    value={boardInfoData.receiveEmail}
                                    onChange={(e) => handleChangeInfoData(e)}
                                    disabled={inputfieldDisabled.receiveEmail}
                                />
                            </Col>
                        </Form.Row>

                        {/* 이메일 발신여부 */}
                        <Form.Row className="mb-2">
                            {/* 이메일 발신여부 */}
                            <Col xs={2.5} className="p-0">
                                <MokaInputLabel
                                    as="switch"
                                    labelWidth={60}
                                    name="emailSendYn"
                                    id="emailSendYn"
                                    className="pr-2 mb-2"
                                    label="이메일\n발신여부"
                                    inputProps={{ checked: boardInfoData.emailSendYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeInfoData(e)}
                                />
                            </Col>

                            {/*  발신 이메일 */}
                            <Col className="p-0">
                                <MokaInputLabel
                                    label="이메일"
                                    labelWidth={40}
                                    className="mb-0 w-100"
                                    id="sendEmail"
                                    name="sendEmail"
                                    placeholder={'이메일'}
                                    value={boardInfoData.sendEmail}
                                    onChange={(e) => handleChangeInfoData(e)}
                                    disabled={inputfieldDisabled.sendEmail}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label={`입력등급`}
                                    as="select"
                                    labelWidth={60}
                                    onChange={(e) => handleChangeInfoData(e)}
                                    name="insLevel"
                                    id="insLevel"
                                    value={boardInfoData.insLevel}
                                >
                                    <option value="">선택</option>
                                    {selectItem.insLevel.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label={`조회등급`}
                                    as="select"
                                    labelWidth={60}
                                    onChange={(e) => handleChangeInfoData(e)}
                                    name="viewLevel"
                                    id="viewLevel"
                                    value={boardInfoData.viewLevel}
                                >
                                    <option value="">선택</option>
                                    {selectItem.viewLevel.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label={`답변등급`}
                                    as="select"
                                    labelWidth={60}
                                    onChange={(e) => handleChangeInfoData(e)}
                                    name="answLevel"
                                    id="answLevel"
                                    value={boardInfoData.answLevel}
                                    disabled={inputfieldDisabled.answLevel}
                                >
                                    <option value="">선택</option>
                                    {selectItem.answLevel.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                            <Col xs={6} className="p-0">
                                <MokaInputLabel
                                    label={`댓글등급`}
                                    as="select"
                                    labelWidth={60}
                                    onChange={(e) => handleChangeInfoData(e)}
                                    name="replyLevel"
                                    id="replyLevel"
                                    value={boardInfoData.replyLevel}
                                    disabled={inputfieldDisabled.replyLevel}
                                >
                                    <option value="">선택</option>
                                    {selectItem.replyLevel.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                    </>
                )}
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
                            <option value="">선택</option>
                            {channeltype_list.map((item, index) => (
                                <option key={index} value={item.dtlCd}>
                                    {item.cdNm}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    {storeBoardType === 'S' && (
                        <Col xs={6} className="p-0">
                            <MokaInputLabel
                                label={`추천`}
                                as="select"
                                labelWidth={60}
                                onChange={(e) => handleChangeInfoData(e)}
                                name="recomFlag"
                                id="recomFlag"
                                value={boardInfoData.recomFlag}
                            >
                                <option value="">선택</option>
                                {selectItem.recomFlag.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </MokaInputLabel>
                        </Col>
                    )}
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
                            disabled={inputfieldDisabled.allowFileCnt}
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
                            disabled={inputfieldDisabled.allowFileSize}
                        />
                    </Col>
                    <Col xs={4}>
                        <MokaInputLabel
                            label="확장자"
                            labelWidth={40}
                            className="mb-0"
                            id="allowFileExt"
                            name="allowFileExt"
                            placeholder={'허용 확장자는 텍스트로 Comma(,)로 구분하여 입력해 주세요'}
                            value={boardInfoData.allowFileExt}
                            onChange={(e) => handleChangeInfoData(e)}
                            disabled={inputfieldDisabled.allowFileExt}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default BoardsEdit;
