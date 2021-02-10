import React, { useEffect, useState, useRef } from 'react';
import { MokaCard } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, GET_SETMENU_BOARD_INFO, getBoardInfo, getSetmenuBoardsList, saveBoardInfo, deleteBoard } from '@store/board';
import toast, { messageBox } from '@utils/toastUtil';
import BoardsForm from './BoardsForm';

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
            title={`게시판 ${true ? '수정' : '등록'}`}
            loading={loading}
            className="flex-fill"
            bodyClassName="d-flex flex-column"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-2' },
                { text: '취소', variant: 'negative', onClick: () => handleClickCancleButton() },
                true && { text: '삭제', variant: 'negative', onClick: () => handleClickDeleteButton(), className: 'ml-2' },
            ].filter((a) => a)}
        >
            <BoardsForm
                channeltype_list={channeltype_list}
                boardInfoData={boardInfoData}
                storeBoardType={storeBoardType}
                onChange={handleChangeInfoData}
                inputfieldDisabled={inputfieldDisabled}
            />
        </MokaCard>
    );
};

export default BoardsEdit;
