import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MokaCard, MokaInputLabel } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ColumnistModal from './modals/RepoterlistModal';
import { notification } from '@utils/toastUtil';
import { GET_COLUMNIST, saveColumnist, changeColumnist, getColumnist, changeInvalidList, changeColumnlistEditMode, clearColumnist } from '@store/columNist';

const ColumnistEdit = ({ history }) => {
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const imgFileRef = useRef(null);
    const [fileValue, setFileValue] = useState(null);
    const [editDisabled, setEditDisabled] = useState(setEditDisabledInitialize);
    const [repoterlistModalShow, setRepoterlistModalShow] = useState(false);
    const [selectRepoterData, setSelectRepoterData] = useState(repoterDataInitialize);
    const [error, setError] = useState(setErrorInitialize);

    const { loading, columnist, invalidList, editmode } = useSelector((store) => ({
        loading: store.loading[GET_COLUMNIST],
        columnist: store.columNist.columnist,
        invalidList: store.columNist.invalidList,
        editmode: store.columNist.editmode,
    }));

    // input 값 변경.
    const tempOnchange = (e) => {
        // FIXME: 2020-11-23 16:50  사용여부가 checkbox 여서 checked 가 있을땐 Y / N 세팅.
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
                seqNo: null,
                status: 'Y', // 디폴드 값.
                repSeq: repoterData.repSeq,
                columnistNm: repoterData.repName,
                email1: tmpEmail[0],
                email2: tmpEmail[1],
                position: '',
                profile: '',
                selectImg: '',
                profile_photo: '',
            });
        } catch (e) {
            console.log('기자 선택후 데이터 set 중 에러발생.', e);
            setSelectRepoterData(repoterDataInitialize);
        }
    };

    // 에디트 정보 설정.
    const setEditData = ({ seqNo, status, repSeq, columnistNm, email1, email2, position, profile_photo, profile, selectImg }) => {
        // 기존 선택 이미지 삭제.
        if (imgFileRef.current) {
            imgFileRef.current.deleteFile();
        }

        setEditDisabled(
            Object.keys(setEditDisabledInitialize).reduce(function (element, key) {
                element[key] = key === 'repSeq' ? true : false;
                return element;
            }, {}),
        ); // input disabled
        setSelectRepoterData({
            seqNo: seqNo,
            status: status,
            repSeq: repSeq,
            columnistNm: columnistNm,
            email1: email1,
            email2: email2,
            position: position,
            profile_photo: profile_photo,
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

        // 이메일1
        if (!editData.email2) {
            errList.push({
                field: 'email1',
                reason: '이메일을 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 이메일2
        if (!editData.email2) {
            errList.push({
                field: 'email2',
                reason: '이메일을 입력해 주세요.',
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

        // 약력 정보.
        if (!editData.profile) {
            errList.push({
                field: 'profile',
                reason: '약력정보를 입력해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 이미지 체크(정보 등록시)
        if (!editData.seqNo && editData.columnistFile === null) {
            errList.push({
                field: 'selectImg',
                reason: '이미지를 선택해 주세요.',
            });
            isInvalid = isInvalid || true;
        }

        // 이미지 체크(정보 수정시)
        if (editData.seqNo && editData.profile_photo === '' && editData.columnistFile === null) {
            errList.push({
                field: 'selectImg',
                reason: '이미지를 선택해 주세요.',
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
            columnistFile: fileValue ? fileValue : null,
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
                        notification('success', '등록하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
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
                        notification('success', '수정하였습니다.');
                    } else {
                        notification('warning', '실패하였습니다.');
                    }
                },
            }),
        );
    };

    // 취소 버튼 클릭.
    const handleClickCancleButton = () => {
        dispatch(changeColumnlistEditMode({ editmode: editmode === false ? true : false }));
        dispatch(clearColumnist());
        history.push(`/columnist`);
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

            setEditData({
                repNo: columnist.repNo,
                // inout: null,
                status: columnist.status, // FIXME: 2020-11-23 16:37 임시 Y
                repSeq: columnist.repSeq,
                seqNo: columnist.seqNo,
                columnistNm: columnist.columnistNm,
                email1: tmpEmail[0],
                email2: tmpEmail[1],
                position: columnist.position,
                profile_photo: columnist.profilePhoto,
                profile: columnist.profile,
                selectImg: columnist.selectImg,
            });
        }
    }, [columnist]);

    // 저장시 벨리데이션 에러 표현.
    useEffect(() => {
        if (invalidList !== null && invalidList.length > 0) {
            setError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
        }
    }, [invalidList]);

    // 등록 버튼 클릭 ( 스토어 이용.)
    useEffect(() => {
        if (editmode === true) {
            setSelectRepoterData(repoterDataInitialize); // 초기화.
            // 에디트 박스 Disable 초기화.
            setEditDisabled(
                Object.keys(setEditDisabledInitialize).reduce(function (element, key) {
                    element[key] = key === 'repSeq' ? true : false;
                    return element;
                }, {}),
            );
        } else {
            // 초기화.
            setSelectRepoterData(repoterDataInitialize);
            setEditDisabled(setEditDisabledInitialize);
        }
    }, [editmode]);

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
            dispatch(changeColumnlistEditMode({ editmode: true }));
            dispatch(
                getColumnist({
                    seqNo: seqNo,
                }),
            );
        }
    }, [dispatch, seqNo]);

    return (
        <MokaCard width={535} title={`칼럼 니스트 ${columnist ? '정보' : '등록'}`} titleClassName="mb-0" loading={loading}>
            <Form className="mb-gutter">
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="status"
                            id="status"
                            className="mb-2"
                            label="사용여부"
                            inputProps={{ checked: selectRepoterData.status === 'Y' ? true : false }}
                            onChange={tempOnchange}
                            disabled={editDisabled.status}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="기자명"
                            className="mb-0"
                            name="columnistNm"
                            value={selectRepoterData.columnistNm}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.columnistNm}
                            disabled={editDisabled.columnistNm}
                            required
                        />
                    </Col>
                    <div className="d-flex justify-content-center">
                        <Col xs={2} className="p-0">
                            <Button variant="negative" className="mr-05" onClick={handleClickReportSearchbutton}>
                                검색
                            </Button>
                        </Col>
                    </div>
                </Form.Row>
                <Form.Row className="d-flex mb-10 text-align-center" style={{ marginLeft: '80px' }}>
                    <Form.Label className="text-danger">* 외부 칼럼니스트 이름을 직접 입력해 주세요.</Form.Label>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label="기자번호"
                            className="mb-0"
                            name="repSeq"
                            value={selectRepoterData.repSeq}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.repSeq}
                            disabled={editDisabled.repSeq}
                        />
                    </Col>
                    <div className="d-flex justify-content-center">
                        <Col xs={2} className="p-0">
                            <Button variant="negative" className="mr-05" onClick={handleClickDeleterepSeq}>
                                삭제
                            </Button>
                        </Col>
                    </div>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="이메일"
                            className="mb-1"
                            name="email1"
                            value={selectRepoterData.email1}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.email1}
                            disabled={editDisabled.email1}
                        />
                    </Col>
                    @
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label=""
                            className="mb-0"
                            name="email2"
                            value={selectRepoterData.email2}
                            onChange={(e) => tempOnchange(e)}
                            isInvalid={error.email2}
                            disabled={editDisabled.email2}
                        />
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
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
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            as="textarea"
                            label="약력정보"
                            className="mb-0"
                            inputClassName="resize-none"
                            name="profile"
                            id="profile"
                            value={selectRepoterData.profile && selectRepoterData.profile}
                            onChange={tempOnchange}
                            isInvalid={error.profile}
                            disabled={editDisabled.profile}
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
                            <span className="required-text">*</span>이미지
                            <br />
                            (200*200)
                            <br />
                            <Button
                                className="mt-1"
                                size="sm"
                                variant="negative"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    imgFileRef.current.deleteFile();
                                }}
                            >
                                삭제
                            </Button>
                        </React.Fragment>
                    }
                    ref={imgFileRef}
                    inputProps={{
                        height: 80,
                        img: selectRepoterData.profile_photo,
                        selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                        setFileValue,
                    }}
                    labelClassName="justify-content-end mr-3"
                />
            </Form>

            <div className="d-flex justify-content-center" style={{ marginTop: 30 }}>
                <div className="d-flex justify-content-center">
                    <Button variant="positive" className="mr-05" onClick={handleClickSaveButton} disabled={editDisabled.savebutton}>
                        저장
                    </Button>
                    <Button variant="negative" className="mr-05" onClick={handleClickCancleButton} disabled={editDisabled.canclebutton}>
                        취소
                    </Button>
                </div>
            </div>
            <ColumnistModal show={repoterlistModalShow} onHide={() => setRepoterlistModalShow(false)} onClickSave={null} onClick={handleRepoterRowClick} />
        </MokaCard>
    );
};

const repoterDataInitialize = {
    seqNo: null,
    inout: null,
    status: null,
    repSeq: null,
    columnistNm: null,
    email: null,
    reg_dt: null,
    reg_id: null,
    mod_dt: null,
    mod_id: null,
    position: null,
    profile_photo: null,
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
    columnistNm: true,
    repSeq: true,
    email1: true,
    email2: true,
    status: true,
    position: true,
    profile: true,
    selectImg: true,
    savebutton: true,
    canclebutton: true,
};

export default ColumnistEdit;
