import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MokaCard, MokaInputLabel } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import { GET_COLUMNIST, saveColumnist, changeColumnist, getColumnist, changeInvalidList, clearColumnist } from '@store/columnist';

/**
 * 칼럼니스트 등록, 수정
 */
const ColumnistEdit = ({ history, match }) => {
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const imgFileRef = useRef(null);
    const [fileValue, setFileValue] = useState(null);
    const [editDisabled, setEditDisabled] = useState(setEditDisabledInitialize);
    const [repoterlistModalShow, setRepoterlistModalShow] = useState(false);
    const [selectRepoterData, setSelectRepoterData] = useState(repoterDataInitialize);
    const [error, setError] = useState(setErrorInitialize);

    const { loading, columnist, invalidList } = useSelector((store) => ({
        loading: store.loading[GET_COLUMNIST],
        columnist: store.columnist.columnist,
        invalidList: store.columnist.invalidList,
    }));

    // input 값 변경.
    const tempOnchange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'status') {
            setSelectRepoterData({
                ...selectRepoterData,
                [name]: checked === true ? 'Y' : 'N',
            });
        } else {
            setSelectRepoterData({
                ...selectRepoterData,
                [name]: value,
            });
        }
    };

    // 기자 검색 버튼 클릭.
    const handleClickReportSearchbutton = () => {
        setRepoterlistModalShow(true);
    };

    // 기자 검색 모달 창에서 기자 선택.
    const handleRepoterRowClick = (repoterData) => {
        // 모달창 닫기.
        setRepoterlistModalShow(false);
        // 기존 데이터 초기화.
        setSelectRepoterData(repoterDataInitialize);

        // 기자 정보 설정
        try {
            let tmpEmail = [];
            tmpEmail = repoterData.repEmail1 && repoterData.repEmail1 && repoterData.repEmail1.split('@');
            setEditData({
                seqNo: columnist.seqNo !== '' ? columnist.seqNo : null,
                status: 'N', // 디폴드 값.
                repSeq: repoterData.repSeq,
                columnistNm: repoterData.repName,
                email1: tmpEmail[0],
                email2: tmpEmail[1],
                position: repoterData.jplusJobInfo,
                profile: '',
                selectImg: '',
                profilePhoto: repoterData.repImg,
            });
        } catch (e) {
            console.log('기자 선택후 데이터 set 중 에러발생.', e);
            setSelectRepoterData(repoterDataInitialize);
        }
    };

    // 에디트 정보 설정.
    const setEditData = ({ seqNo, status, repSeq, columnistNm, email1, email2, position, profilePhoto, profile, selectImg }) => {
        setEditDisabled(
            Object.keys(setEditDisabledInitialize).reduce(function (element, key) {
                element[key] = key === 'repSeq' ? true : false;
                return element;
            }, {}),
        ); // input disabled
        setError(setErrorInitialize);
        setSelectRepoterData({
            seqNo: seqNo,
            status: status,
            repSeq: repSeq,
            columnistNm: columnistNm,
            email1: email1,
            email2: email2,
            position: position,
            profilePhoto: profilePhoto,
            profile: profile,
            selectImg: selectImg,
        });
    };

    /**
     * 유효성 검사
     */
    const validate = (editData) => {
        let isInvalid = false;
        let errList = [];

        // 기자명
        if (!editData.columnistNm) {
            errList.push({
                field: 'columnistNm',
                reason: '기자명을 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 직책
        if (!editData.position) {
            errList.push({
                field: 'position',
                reason: '직책을 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    // 저장 버튼 클릭.
    const handleClickSaveButton = () => {
        // 이미지 설정.
        let saveData = {
            ...selectRepoterData,
            columnistFile: fileValue,
        };

        // 이메일 합치는거 때문에 미리 체크.
        if (validate(saveData)) {
            // 이메일 설정.
            const tmpEmail = saveData.email1 && saveData.email2 ? `${saveData.email1}@${saveData.email2}` : ``;
            delete saveData.email1;
            delete saveData.email2;
            delete saveData.selectImg;
            saveData.email = tmpEmail;

            if (saveData.seqNo) {
                updateColunmList(saveData);
            } else {
                insertColunmList(saveData);

                // 등록 일떄 기존 이미지 삭제.
                if (imgFileRef.current) {
                    imgFileRef.current.deleteFile();
                }
            }
        }
    };

    // 등록 처리.
    const insertColunmList = (insertData) => {
        dispatch(
            saveColumnist({
                type: 'insert',
                actions: [changeColumnist({ ...insertData })],
                callback: (response) => {
                    if (response.header.success) {
                        setError(setErrorInitialize);
                        history.push(`${match.path}/${response.body.seqNo}`);
                        toast.success(response.header.message);
                    }
                },
            }),
        );
    };

    // 정보 업데이트 처리.
    const updateColunmList = (updateData) => {
        dispatch(
            saveColumnist({
                type: 'update',
                actions: [changeColumnist({ ...updateData })],
                callback: (response) => {
                    if (response.header.success) {
                        setError(setErrorInitialize);
                        dispatch(
                            getColumnist({
                                seqNo: updateData.seqNo,
                            }),
                        );
                        toast.success(response.header.message);
                    }
                },
            }),
        );
    };

    // 취소 버튼 클릭.
    const handleClickCancleButton = () => {
        dispatch(clearColumnist());
        history.push(match.path);
    };

    // 기자번호 삭제.
    const handleClickDeleterepSeq = () => {
        setSelectRepoterData({
            ...selectRepoterData,
            repSeq: '',
        });
    };

    // 리트스에서 아이템 클릭후 store 값 변경 되면 정보 변경.
    useEffect(() => {
        if (columnist) {
            let tmpEmail = [];
            tmpEmail = columnist.email !== 'undefined' && columnist.email != null && columnist.email.split('@');
            // setSelectRepoterData(repoterDataInitialize);
            setEditData({
                repNo: columnist.repNo,
                // inout: null,
                status: columnist.status,
                repSeq: columnist.repSeq,
                seqNo: columnist.seqNo,
                columnistNm: columnist.columnistNm,
                email1: tmpEmail[0],
                email2: tmpEmail[1],
                position: columnist.position,
                profilePhoto: columnist.profilePhoto,
                profile: columnist.profile,
                selectImg: columnist.selectImg,
            });
        }
    }, [columnist]);

    // 저장시 벨리데이션 에러 표현.
    useEffect(() => {
        if (invalidList !== null && invalidList.length > 0) {
            setError(invalidListToError(invalidList));

            // alert message 동시에 여러개일 경우.
            // messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});

            // alert message 처음 메시지 하나만.
            messageBox.alert(invalidList[0].reason, () => {});
        }
    }, [invalidList]);

    // 등록 버튼 클릭 ( 스토어 이용.)
    useEffect(() => {
        setSelectRepoterData(repoterDataInitialize);
        setEditDisabled(setEditDisabledInitialize);
        setError(setErrorInitialize);
    }, []);

    // 페이지 시작.
    useEffect(() => {
        const pageLoading = () => {
            setEditDisabled(setEditDisabledInitialize);
        };

        pageLoading();
    }, []);

    // 라우터 변경 체크(목록에서 클릭.)
    useEffect(() => {
        if (seqNo) {
            dispatch(
                getColumnist({
                    seqNo: seqNo,
                }),
            );
        }
    }, [dispatch, seqNo]);

    useEffect(() => {
        return () => {
            setSelectRepoterData(repoterDataInitialize);
            // setEditDisabled(setEditDisabledInitialize);
            setError(setErrorInitialize);
            dispatch(clearColumnist());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            title={`칼럼니스트 ${columnist && columnist.seqNo && columnist.seqNo !== '' ? '수정' : '등록'}`}
            className="w-100 flex-fill"
            loading={loading}
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                {
                    text: `${columnist && columnist.seqNo && columnist.seqNo !== '' ? '수정' : '저장'}`,
                    onClick: handleClickSaveButton,
                    variant: 'positive',
                    disabled: editDisabled.editBoxButton,
                    className: 'mr-1',
                    useAuth: true,
                },
                {
                    text: '취소',
                    onClick: handleClickCancleButton,
                    variant: 'negative',
                    disabled: editDisabled.editBoxButton,
                },
            ]}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="status"
                            id="status"
                            label="사용여부"
                            inputProps={{ checked: selectRepoterData.status === 'Y' ? true : false }}
                            onChange={tempOnchange}
                            disabled={editDisabled.editBoxButton}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-1">
                    <Col xs={7} className="p-0 d-flex">
                        <MokaInputLabel
                            label="기자명"
                            className="mr-2"
                            name="columnistNm"
                            value={selectRepoterData.columnistNm}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.columnistNm}
                            disabled={editDisabled.columnistNm}
                            required
                        />
                        <Button variant="searching" className="flex-shrink-0" onClick={handleClickReportSearchbutton} disabled={editDisabled.editBoxButton}>
                            기자검색
                        </Button>
                    </Col>
                </Form.Row>

                <div className="mb-2 d-flex">
                    <MokaInputLabel as="none" label=" " />
                    <p className="mb-0 text-positive">* 외부 칼럼니스트 이름을 직접 입력해 주세요.</p>
                </div>

                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0 d-flex">
                        <MokaInputLabel
                            label="기자번호"
                            className="mr-2"
                            name="repSeq"
                            value={selectRepoterData.repSeq}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.repSeq}
                            disabled={editDisabled.repSeq}
                        />
                        <Button variant="negative" className="flex-shrink-0" onClick={handleClickDeleterepSeq} disabled={editDisabled.editBoxButton}>
                            삭제
                        </Button>
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="직책"
                            className="mb-0"
                            name="position"
                            value={selectRepoterData.position}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.position}
                            disabled={editDisabled.position}
                            required
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="이메일"
                            name="email1"
                            value={selectRepoterData.email1}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.email1}
                            disabled={editDisabled.email1}
                        />
                    </Col>
                    <Col xs={1} className="text-center pt-1">
                        @
                    </Col>
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label=""
                            name="email2"
                            value={selectRepoterData.email2}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.email2}
                            disabled={editDisabled.email2}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="약력정보"
                            name="profile"
                            id="profile"
                            value={selectRepoterData.profile && selectRepoterData.profile}
                            onChange={tempOnchange}
                            isInvalid={error.profile}
                            disabled={editDisabled.profile}
                            inputProps={{ rows: 5 }}
                        />
                    </Col>
                </Form.Row>

                {/* 이미지 */}
                <MokaInputLabel
                    as="imageFile"
                    className="mb-2"
                    name="selectImg"
                    isInvalid={error.selectImg}
                    label={
                        <React.Fragment>
                            이미지
                            <br />
                            <span className="color-danger">(200*200)</span>
                            <Button
                                variant="gray-700"
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                    imgFileRef.current.rootRef.onClick(e);
                                }}
                            >
                                신규등록
                            </Button>
                        </React.Fragment>
                    }
                    ref={imgFileRef}
                    inputProps={{
                        width: 267,
                        img: selectRepoterData.profilePhoto,
                        selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                        setFileValue,
                        deleteButton: true,
                    }}
                    labelClassName="justify-content-end"
                />
            </Form>

            {/* 기자 검색 모달 */}
            <ReporterListModal show={repoterlistModalShow} onHide={() => setRepoterlistModalShow(false)} onClickSave={null} onClick={handleRepoterRowClick} />
        </MokaCard>
    );
};

const repoterDataInitialize = {
    seqNo: null,
    inout: null,
    status: 'N',
    repSeq: null,
    columnistNm: null,
    email: null,
    reg_dt: null,
    reg_id: null,
    mod_dt: null,
    mod_id: null,
    position: null,
    profilePhoto: null,
    profile: null,
    selectImg: null,
};

const setErrorInitialize = {
    repSeq: false,
    columnistNm: false,
    email1: false,
    email2: false,
    status: null,
    position: null,
    profile: null,
    selectImg: null,
};

const setEditDisabledInitialize = {
    columnistNm: false,
    repSeq: true,
    email1: false,
    email2: false,
    status: false,
    position: false,
    profile: false,
    selectImg: false,
    editBoxButton: false,
};

export default ColumnistEdit;
