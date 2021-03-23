import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { MokaCard } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@/utils/regexUtil';
import { initialState, clearSetmenuBoardInfo, GET_SET_MENU_BOARD_INFO, getBoardInfo, getSetMenuBoardsList, saveBoardInfo, deleteBoard } from '@store/board';
import BoardsForm from './BoardsForm';

/**
 * 게시판 관리 > 전체 게시판 편집(등록, 수정)
 */
const BoardsEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { boardId } = useParams();
    // 공통 구분값 URL
    const { boardType, boardInfo, loading, channelTypeList } = useSelector(
        (store) => ({
            boardType: store.board.boardType,
            boardInfo: store.board.setMenu.boardInfo,
            channelTypeList: store.board.channelTypeList,
            loading: store.loading[GET_SET_MENU_BOARD_INFO],
        }),
        shallowEqual,
    );

    // 게시판 폼 필드값
    const [boardInfoData, setBoardInfoData] = useState(initialState.setMenu.boardInfo);

    // 게시판 체크박스 컬럼 state
    const [items, setItems] = useState({
        ADDR: false,
        MOBILE_POHONE: false,
        EMAIL: false,
        URL: false,
    });

    // monaco 에디터 스테이트 버그가 있어서 상태를 만들어 주고 상태가 업데이트 되면 렌더링 될수 있게 수정
    const [editState, setEeditState] = useState(null);
    // error
    const [error, setError] = useState([]);

    /**
     * change input value
     */
    const handleChangeValue = (e) => {
        const { name, value, checked, type } = e.target;
        if (name === 'usedYn' || name === 'emailReceiveYn' || name === 'answPushYn' || name === 'emailSendYn' || name === 'pushYn' || name === 'fileYn' || name === 'ordYn') {
            setBoardInfoData({ ...boardInfoData, [name]: checked ? 'Y' : 'N' });
        } else if (type === 'checkbox') {
            // 답변 checkbox 버튼 checked시 답변메일 발신, 답변 PUSH 발송 활성화
            if (name === 'allowItem') {
                // 로컬 state 사용 컬럼 상태 업데이트
                setItems({ ...items, [value]: checked ? true : false });
            } else {
                setBoardInfoData({ ...boardInfoData, [name]: checked ? 'Y' : 'N' });
            }
        } else {
            setBoardInfoData({ ...boardInfoData, [name]: value });
        }
    };

    /**
     * 유효성 검사
     * @param {object} save 데이터
     */
    const validate = (save) => {
        let isInvalid = false;
        let errList = [];

        // 타이틀
        if (!save.boardName || !REQUIRED_REGEX.test(save.boardName)) {
            errList.push({
                field: 'boardName',
                reason: '게시판 명을 입력해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 답변 true로 선택 후 답변 등급 선택 안했을 때
        if (save.answYn === 'Y' && save.answLevel === '') {
            errList.push({
                field: 'answLevel',
                reason: '답변 등급을 선택해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 이메일 수신여부 true 선택 후 이메일을 입력 안했을 때
        if (save.answYn === 'Y' && save.emailReceiveYn === 'Y' && !REQUIRED_REGEX.test(save.receiveEmail)) {
            errList.push({
                field: 'receiveEmail',
                reason: '이메일을 입력해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 이메일 발신여부 true 선택 후 이메일을 입력 안했을 때
        if (save.emailSendYn === 'Y' && !REQUIRED_REGEX.test(save.sendEmail)) {
            errList.push({
                field: 'sendEmail',
                reason: '이메일을 입력해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 파일 true 선택 후 개수를 입력 안했을 때
        if (save.fileYn === 'Y' && save.allowFileCnt === 0) {
            errList.push({
                field: 'allowFileCnt',
                reason: '개수를 입력해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 파일 true 선택 후 용량을 입력 안했을 때
        if (save.fileYn === 'Y' && save.allowFileSize === 0) {
            errList.push({
                field: 'allowFileSize',
                reason: '용량을 입력해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 파일 true 선택 후 확장자를 입력 안했을 때
        if (save.fileYn === 'Y' && !REQUIRED_REGEX.test(save.allowFileExt)) {
            errList.push({
                field: 'allowFileExt',
                reason: '확장자를 선택해 주세요',
            });
            isInvalid = isInvalid || true;
        }

        // // 입력 등급을 선택 안했을떄.
        // if (!boardInfoData.insLevel) {
        //     return {
        //         state: false,
        //         message: '입력 등급을 선택해 주세요.',
        //     };
        // }

        // // 조회 등급을 선택 안했을떄.
        // if (!boardInfoData.viewLevel) {
        //     return {
        //         state: false,
        //         message: '조회 등급을 선택해 주세요.',
        //     };
        // }

        // // 추천 항목을 선택 안했을떄.
        // if (!boardInfoData.recomFlag) {
        //     return {
        //         state: false,
        //         message: '추천을 선택해 주세요.',
        //     };
        // }

        setError(errList);
        return !isInvalid;
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

    /**
     * 저장 버튼
     */
    const handleClickSaveButton = () => {
        let saveObj = {
            ...boardInfoData,
            boardType,
        };
        if (validate(saveObj)) {
            dispatch(
                saveBoardInfo({
                    boardInfo: saveObj,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            if (body.boardId) {
                                history.push(`${match.path}/${boardId}`);
                            }
                        } else {
                            const { totalCnt, list } = body;
                            if (totalCnt > 0 && Array.isArray(list)) {
                                // 에러 메시지 확인
                                messageBox.alert(list[0].reason, () => {});
                            } else {
                                // 에러이지만 에러메시지가 없으면 서버 메시지를 alert
                                messageBox.alert(header.message, () => {});
                            }
                        }
                    },
                }),
            );
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDeleteButton = () => {
        messageBox.confirm('삭제 하시겠습니까?', () => {
            dispatch(
                deleteBoard({
                    boardId: boardInfo.boardId,
                    callback: ({ header: { success, message }, body }) => {
                        if (success === true) {
                            toast.success(message);
                            dispatch(getSetMenuBoardsList()); // 리스트를 다시 가지고 옴.
                            history.push(`${match.path}`);
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

    /**
     * 취소 버튼
     */
    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        // boardId param이 존재하면 상세 조회, boardInfo초기화
        if (boardId) {
            dispatch(getBoardInfo(boardId));
        } else {
            dispatch(clearSetmenuBoardInfo());
        }
    }, [boardId, dispatch]);

    useEffect(() => {
        // 스토어 데이터 로컬에 셋팅
        setBoardInfoData(boardInfo);
    }, [boardInfo]);

    useEffect(() => {
        let itemArr = [];
        Object.keys(items).forEach((i) => {
            if (items[i]) {
                itemArr.push(i);
            }
        });

        if (itemArr.length > 0) {
            setBoardInfoData({ ...boardInfoData, allowItem: itemArr.join(',') });
        } else {
            setBoardInfoData({ ...boardInfoData, allowItem: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    useEffect(() => {
        // allowItem이 있으면 로컬 체크박스 컬럼 state 변경
        if (boardInfoData.allowItem) {
            let ai = boardInfoData.allowItem.split(',');
            const findItem = (el) => ai.find((i) => i === el);

            setItems({
                ...items,
                ADDR: findItem('ADDR') ? true : false,
                MOBILE_POHONE: findItem('MOBILE_POHONE') ? true : false,
                EMAIL: findItem('EMAIL') ? true : false,
                URL: findItem('URL') ? true : false,
            });
        } else {
            setItems({ ...items, ADDR: false, MOBILE_POHONE: false, EMAIL: false, URL: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardInfoData.allowItem]);

    useEffect(() => {
        // Monaco 에디터 렌더링 때 참조할 state 처리
        if (loading === false && boardId === undefined) {
            setEeditState(false);
        } else {
            setEeditState(loading);
        }
    }, [boardId, loading]);

    return (
        <MokaCard
            title={`게시판 ${boardId ? '수정' : '등록'}`}
            loading={loading}
            className="w-100"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                boardId &&
                    boardInfoData.headerContent &&
                    boardInfoData.footerContent && { text: '미리보기', variant: 'outline-neutral', onClick: handleCLickBoardPriveButton, className: 'mr-1' },
                { text: boardId ? '수정' : '저장', variant: 'positive', onClick: handleClickSaveButton, className: 'mr-1' },
                boardId && { text: '삭제', variant: 'negative', onClick: handleClickDeleteButton, className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: handleClickCancleButton },
            ].filter((a) => a)}
        >
            <BoardsForm
                channelTypeList={channelTypeList}
                boardInfoData={boardInfoData}
                setBoardInfoData={setBoardInfoData}
                items={items}
                onChangeValue={handleChangeValue}
                loading={editState}
                error={error}
                setError={setError}
            />
        </MokaCard>
    );
};

export default BoardsEdit;
