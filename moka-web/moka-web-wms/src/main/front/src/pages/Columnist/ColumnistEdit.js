import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { JPLUS_REP_DIV_DEFAULT } from '@/constants';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import { initialState, GET_COLUMNIST, saveColumnist, getColumnist, changeInvalidList, clearColumnist } from '@store/columnist';

/**
 * 칼럼니스트 > 등록, 수정
 */
const ColumnistEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { seqNo } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_COLUMNIST]);
    const { columnist, invalidList } = useSelector(({ columnist }) => columnist);
    const jplusRepRows = useSelector(({ codeMgt }) => codeMgt.jplusRepRows);
    const [temp, setTemp] = useState(initialState.columnist);
    const [jplusRepDivNm, setJplusRepDivNm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState({});
    const imgFileRef = useRef(null);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'status') {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else {
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * 이미지 파일 변경
     * @param {*} file 파일데이터
     */
    const handleChangeFile = (file) => setTemp({ ...temp, columnistFile: file });

    /**
     * 기자번호 삭제
     */
    const handleDeleteRepSeq = () => setTemp({ ...temp, repSeq: '' });

    /**
     * 기자 모달 > 기자 선택
     * @param {object} reporter 기자 데이터
     */
    const addReporter = (reporter) => {
        try {
            // 기자 정보 설정
            let tmpEmail = [];
            tmpEmail = reporter.repEmail1 && reporter.repEmail1.split('@');

            // 2021.03.31 reporter.jplusRepDiv가 코드가 아니라 코드명(cdNm)이 넘어옴.
            // 칼럼니스트 저장할 때 코드가 넘어가야합니다. 코드 -> 코드명으로 변환하는 로직은 하위 useEffect에서 처리하고 있음
            // 만약 서버에서 jplusRepDivNm같이 코드명을 넘겨준다면 useEffect제거하고 그 코드명을 노출하세요
            // test case1) 선택한 기자 없음 (NULL => JPLUS_REP_DIV_DEFAULT 노출)
            // test case2) 강인춘 (jplusRepDiv === R2)
            // test case3) 서회란 (jplusRepDiv === R1)
            // J1은 데이터가 없어서 테스트 불가능

            setTemp({
                ...initialState.reporter,
                seqNo: temp.seqNo,
                repSeq: reporter.repSeq,
                columnistNm: reporter.repName,
                status: 'N',
                email1: tmpEmail[0],
                email2: tmpEmail[1],
                position: reporter.jplusJobInfo,
                jplusRepDiv: reporter.jplusRepDiv,
                profile: '',
                selectImg: '',
                profilePhoto: reporter.repImg,
            });
        } catch (e) {
            console.log('기자 데이터 파싱 중 에러', e);
        }
        setShowModal(false);
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

    /**
     * 칼럼니스트 저장
     */
    const handleSave = () => {
        let saveData = temp;
        saveData.inout = saveData.repSeq ? 'I' : 'O'; // 외부/내부 필진 설정

        if (validate(saveData)) {
            // 이메일 설정
            const tmpEmail = saveData.email1 && saveData.email2 ? `${saveData.email1}@${saveData.email2}` : ``;
            delete saveData.email1;
            delete saveData.email2;
            delete saveData.selectImg;
            saveData.email = tmpEmail;

            dispatch(
                saveColumnist({
                    columnist: saveData,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            history.push(`${match.path}/${body.seqNo}`);
                            toast.success(header.message);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 취소
     */
    const handleClickCancelButton = () => history.push(match.path);

    useEffect(() => {
        if (columnist) {
            let tmpEmail = [];
            tmpEmail = columnist.email !== 'undefined' && columnist.email != null && columnist.email.split('@');
            setTemp({
                ...columnist,
                email1: tmpEmail[0],
                email2: tmpEmail[1],
            });
        }
    }, [columnist]);

    useEffect(() => {
        // 코드타입 명칭 셋팅
        if (jplusRepRows) {
            const jplusRepDivNm = (jplusRepRows.map((code) => code.dtlCd === temp.jplusRepDiv)?.cdNm || JPLUS_REP_DIV_DEFAULT).slice(0, 2);
            setJplusRepDivNm(jplusRepDivNm);
        }
    }, [temp.repSeq, temp.jplusRepDiv, jplusRepRows]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
        if (invalidList !== null && invalidList.length > 0) {
            messageBox.alert(invalidList[0].reason, () => {});
        }
    }, [invalidList]);

    useEffect(() => {
        setError({});
        if (seqNo) {
            dispatch(
                getColumnist({
                    seqNo,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearColumnist());
        }
    }, [dispatch, seqNo]);

    useEffect(() => {
        return () => {
            dispatch(clearColumnist());
            dispatch(changeInvalidList([]));
        };
    }, [dispatch]);

    return (
        <MokaCard
            title={`칼럼니스트 ${temp.seqNo ? '수정' : '등록'}`}
            className="w-100 flex-fill"
            loading={loading}
            footerButtons={[
                {
                    text: `${temp.seqNo ? '수정' : '저장'}`,
                    onClick: handleSave,
                    variant: 'positive',
                    className: 'mr-1',
                    useAuth: true,
                },
                {
                    text: '취소',
                    onClick: handleClickCancelButton,
                    variant: 'negative',
                },
            ]}
        >
            <div>
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="status"
                            id="status"
                            label="사용여부"
                            inputProps={{ checked: temp.status === 'Y' ? true : false }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>

                {/* 기자명 */}
                <Form.Row className="mb-2">
                    <Col xs={7} className="p-0 d-flex">
                        <MokaInputLabel
                            label="기자명"
                            className="mr-2"
                            name="columnistNm"
                            value={temp.columnistNm}
                            onChange={handleChangeValue}
                            isInvalid={error.columnistNm}
                            required
                        />
                        <Button variant="searching" className="flex-shrink-0" onClick={() => setShowModal(true)}>
                            기자검색
                        </Button>
                        <ReporterListModal show={showModal} onHide={() => setShowModal(false)} onRowClicked={addReporter} />
                    </Col>
                </Form.Row>

                <div className="mb-2 d-flex">
                    <MokaInputLabel as="none" label=" " />
                    <p className="mb-0 text-positive">* 외부 칼럼니스트 이름을 직접 입력해 주세요.</p>
                </div>

                {/* 기자번호 */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0 d-flex">
                        <MokaInputLabel label="기자번호" className="mr-2" name="repSeq" value={temp.repSeq} onChange={handleChangeValue} isInvalid={error.repSeq} disabled />
                        <Button variant="negative" className="flex-shrink-0" onClick={handleDeleteRepSeq}>
                            삭제
                        </Button>
                    </Col>
                </Form.Row>

                {/* 타입코드 (변경불가, 기자 선택 시 자동 입력) */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label="타입코드" value={jplusRepDivNm} disabled />
                    </Col>
                </Form.Row>

                {/* 직책 */}
                <MokaInputLabel className="mb-2" label="직책" name="position" value={temp.position} onChange={handleChangeValue} isInvalid={error.position} required />

                {/* 이메일 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label="이메일" name="email1" value={temp.email1} onChange={handleChangeValue} isInvalid={error.email1} />
                    </Col>
                    <Col xs={1} className="text-center pt-1">
                        @
                    </Col>
                    <Col xs={5} className="p-0">
                        <MokaInput name="email2" value={temp.email2} onChange={handleChangeValue} isInvalid={error.email2} />
                    </Col>
                </Form.Row>

                {/* 약력정보 */}
                <MokaInputLabel
                    className="mb-2"
                    as="textarea"
                    label="약력정보"
                    name="profile"
                    id="profile"
                    value={temp.profile}
                    onChange={handleChangeValue}
                    isInvalid={error.profile}
                    inputProps={{ rows: 5 }}
                />

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
                            <Button variant="gray-700" size="sm" className="mt-1" onClick={(e) => imgFileRef.current.rootRef.onClick(e)}>
                                신규등록
                            </Button>
                        </React.Fragment>
                    }
                    ref={imgFileRef}
                    inputProps={{
                        width: 267,
                        img: temp.profilePhoto,
                        selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정
                        setFileValue: handleChangeFile,
                        deleteButton: true,
                    }}
                />
            </div>
        </MokaCard>
    );
};

export default ColumnistEdit;
