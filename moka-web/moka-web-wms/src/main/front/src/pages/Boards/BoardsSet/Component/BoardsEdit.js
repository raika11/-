import React, { useEffect, useState, useRef } from 'react';
import { MokaCard } from '@components';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, GET_SETMENU_BOARD_INFO, getBoardInfo, getSetmenuBoardsList, saveBoardInfo, deleteBoard } from '@store/board';
import toast, { messageBox } from '@utils/toastUtil';
import BoardsForm from './BoardsForm';
import { selectItem } from '@pages/Boards/BoardConst';

const BoardsEdit = ({ match }) => {
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

    // mobaco 에디터 스테이트 버그가 있어서 상태를 만들어 주고 상태가 업데이트 되면 렌더링 될수 있게 수정.
    const [editState, setEeditState] = useState(null);

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
        const { name, value, checked, type } = e.target;
        let allowItemList = [];
        if (boardInfoData.allowItem) {
            allowItemList = boardInfoData.allowItem
                .split(',')
                .map((e) => e.replace(' ', ''))
                .filter((e) => e !== '');
        }

        // checkbox 값이 변경되면 연관 필드 값도 disabled 시켜줌.
        if (type === 'checkbox') {
            tempObject = {
                ...boardInfoData,
                [name]: checked === true ? 'Y' : 'N',
            };

            // 답변 checkbox 버튼
            if (name === 'answYn' && checked === false) {
                if (tempObject.emailReceiveYn === 'Y') {
                    tempObject = {
                        ...tempObject,
                        emailReceiveYn: 'N',
                    };
                }
            }
            // 답변 메일 발신 을 체크 했을경우에 가용기능 선택에 답변이 헤재 되어 있을경우 선택 해준다.
            if (name === 'emailReceiveYn' && checked === true) {
                if (tempObject.answYn === 'N') {
                    tempObject = {
                        ...tempObject,
                        answYn: 'Y',
                    };
                }
            }

            if (name === 'fileYn' && checked === true) {
                setBoardInfoData({
                    ...boardInfoData,
                    allowFileExt: selectItem.FileExt,
                });
            } else if (name === 'fileYn' && checked === true) {
                setBoardInfoData({
                    ...boardInfoData,
                    allowFileExt: '',
                });
            }

            // 사용 컬럼.
            if (name.substr(0, 9) === 'allowItem') {
                let tempItem = name.substr(10); // ex) allowItem-EMAIL -> EMAIL

                if (checked) {
                    if (allowItemList.indexOf(tempItem) < 0) {
                        allowItemList.push(tempItem);
                    }
                } else {
                    allowItemList = allowItemList.filter((e) => e !== tempItem);
                }

                if (allowItemList.length > 0) {
                    tempObject = {
                        ...tempObject,
                        allowItem: allowItemList.join(','),
                    };
                } else {
                    tempObject = {
                        ...tempObject,
                        allowItem: '',
                    };
                }
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
    // const makeAdminFormData = () => {
    //     let returnFormData = {
    //         ...boardInfoData,
    //         boardType: storeBoardType,
    //     };

    //     // 파일 등록
    //     // 파일 등록 선택후 개수 입력 안했을때.
    //     if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileCnt) {
    //         return {
    //             state: false,
    //             message: '개수를 입력해 주세요.',
    //         };
    //     }

    //     // 파일 등록 선택후 용량 입력 안했을때.
    //     if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileSize) {
    //         return {
    //             state: false,
    //             message: '용량을 입력해 주세요.',
    //         };
    //     }

    //     // 파일 등록 선택후 확장자 입력 안했을때.
    //     if (boardInfoData.fileYn === 'Y' && !boardInfoData.allowFileExt) {
    //         return {
    //             state: false,
    //             message: '확장자를 선택해 주세요.',
    //         };
    //     }

    //     return {
    //         state: true,
    //         data: returnFormData,
    //         message: '',
    //     };
    // };

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
        // if (boardInfoData.replyYn === 'Y' && !boardInfoData.replyLevel) {
        //     return {
        //         state: false,
        //         message: '댓글 등급을 선택해 주세요.',
        //     };
        // }

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
                message: '확장자를 선택 주세요.',
            };
        }

        if (boardInfoData.fileYn === 'N') {
            returnFormData = {
                ...returnFormData,
                allowFileExt: '',
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

        // if (storeBoardType === 'S') {
        //     formData = makeServiceFormData();
        // } else {
        //     formData = makeAdminFormData();
        // }
        formData = makeServiceFormData();

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

    // 삭제 버튼 처리.
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

    const handleCLickBoardPriveButton = () => {
        window.open(boardInfoData.boardUrl);
    };

    // URL 에서 boardId 값을 가지고 와서 설정.
    useEffect(() => {
        const setParamBoardId = ({ boardId }) => {
            // url 로 boardId 값이 변경 되면 해당 게시판 정보를 가지고 옴.
            if (isNaN(boardId) === false && paramBoardId.current !== boardId) {
                paramBoardId.current = boardId;

                dispatch(getBoardInfo({ boardId: boardId }));
                // url 에 add 일 경우는 게시판 정보 상태값을 초기화 한다.
            } else if (boardId === 'add') {
                setBoardInfoData({
                    ...initialState.setmenu.boardinfo,
                    allowFileExt: selectItem.FileExt,
                });
            }
        };
        setParamBoardId(params);
    }, [dispatch, params]);

    useEffect(() => {
        // url 이 변경 되거나 게시판 정보를 다시 가지고 오면 store 값을 읽어서 게시판 정보 스테이트를 변경 해준다.
        if (boardinfo === initialState.setmenu.boardinfo) {
            setBoardInfoData({
                ...boardinfo,
                allowItem: boardinfo.allowItem === null ? '' : boardinfo.allowItem,
            });
        } else {
            setBoardInfoData({
                ...boardinfo,
                allowItem: boardinfo.allowItem === null ? '' : boardinfo.allowItem,
            });
        }
    }, [boardinfo]);

    // 게시판 정보 스테이트가 변경 되면 check 값을 확인해서 관련 input 을 disabled 해준다.
    useEffect(() => {
        setInputfieldDisabled({
            ...inputfieldDisabled,
            answLevel: boardInfoData.answYn !== 'Y',
            receiveEmail: boardInfoData.emailReceiveYn !== 'Y',
            sendEmail: boardInfoData.emailSendYn !== 'Y',
            allowFileCnt: boardInfoData.fileYn !== 'Y',
            allowFileSize: boardInfoData.fileYn !== 'Y',
            allowFileExt: boardInfoData.fileYn !== 'Y',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardInfoData]);

    // Monaco 에디터 렌더링 때 참조할 스테이트 처리.
    useEffect(() => {
        if (loading === false && params.boardId === undefined) {
            setEeditState(false);
        } else {
            setEeditState(loading);
        }
    }, [params, loading]);

    return (
        <MokaCard
            title={`게시판 ${params.boardId ? '수정' : '등록'}`}
            loading={loading}
            className="w-100 flex-fill"
            // bodyClassName="d-flex flex-column"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                params.boardId && boardInfoData.boardUrl && { text: '미리보기', variant: 'outline-neutral', onClick: () => handleCLickBoardPriveButton(), className: 'mr-1' },
                { text: params.boardId ? '수정' : '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-1' },
                params.boardId && { text: '삭제', variant: 'negative', onClick: () => handleClickDeleteButton(), className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: () => handleClickCancleButton() },
            ].filter((a) => a)}
        >
            <BoardsForm
                channeltype_list={channeltype_list}
                boardInfoData={boardInfoData}
                storeBoardType={storeBoardType}
                formInputOnChange={handleChangeInfoData}
                inputfieldDisabled={inputfieldDisabled}
                loading={editState}
            />
        </MokaCard>
    );
};

export default BoardsEdit;
