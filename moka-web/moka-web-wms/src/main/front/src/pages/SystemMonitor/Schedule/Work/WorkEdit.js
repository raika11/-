import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';
import { DB_DATEFORMAT } from '@/constants';
import toast, { messageBox } from '@/utils/toastUtil';
import { invalidListToError } from '@/utils/convertUtil';
import { getBoSchjob } from '@/store/codeMgt';
import { initialState, getJob, clearJob, saveJob, deleteJob } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 작업 목록 등록, 수정
 */
const WorkEdit = ({ match }) => {
    const history = useHistory();
    const { jobSeq } = useParams();
    const dispatch = useDispatch();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const boSchjobRows = useSelector((store) => store.codeMgt.boSchjobRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const job = useSelector((store) => store.schedule.work.job);
    const [data, setData] = useState(initialState.work.job);
    const [error, setError] = useState({});

    /**
     * input value
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setData({ ...data, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'ftpPassive') {
            setData({ ...data, ftpPassive: checked ? 'Y' : 'N' });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    /**
     * 유효성 검사
     * @param {object} 검사 대상
     */
    const validate = (obj) => {
        let isInvalid = false,
            errList = [];

        // if (!obj.category) {
        //     errList.push({
        //         field: 'category',
        //         reason: '스케줄 작업 분류를 선택하세요',
        //     });
        //     isInvalid = isInvalid | true;
        // }

        if (!obj.targetPath) {
            errList.push({
                field: 'targetPath',
                reason: '배포 경로를 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        if (!obj.pkgNm) {
            errList.push({
                field: 'pkgNm',
                reason: '패키지 명을 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        if (!obj.callUrl) {
            errList.push({
                field: 'callUrl',
                reason: '호출 URL을 입력하세요',
            });
            isInvalid = isInvalid | true;
        }

        // if (!obj.jobDesc) {
        //     errList.push({
        //         field: 'jobDesc',
        //         reason: '설명을 입력하세요',
        //     });
        //     isInvalid = isInvalid | true;
        // }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        if (validate(data)) {
            console.log(data);
            let temp = {
                ...data,
                ftpPassive: data.sendType === 'FTP' ? data.ftpPassive : 'N',
                period: data.jobType === 'R' ? 0 : data.period,
            };
            dispatch(
                saveJob({
                    job: temp,
                    jobSeq: jobSeq ? Number(jobSeq) : null,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
            // console.log(temp);
        } else {
            console.log(error);
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        dispatch(
            deleteJob({
                jobSeq: Number(jobSeq),
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success('삭제되었습니다.');
                        history.push(`${match.path}`);
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        // 데이터 조회 액션
        if (jobSeq) {
            dispatch(getJob(jobSeq));
        } else {
            dispatch(clearJob());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobSeq]);

    useEffect(() => {
        setData({ ...data, ...job });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job]);

    useEffect(() => {
        // 스케줄러 예약 코드
        dispatch(getBoSchjob());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Card.Header>
                <Card.Title as="h2">{jobSeq ? '작업 수정' : '작업 등록'}</Card.Title>
            </Card.Header>
            <Card.Body className="custom-scroll" style={{ height: 496 }}>
                <Form>
                    <Form.Row className="mb-2">
                        <Col xs={4} className="p-0">
                            <MokaInputLabel as="select" label="분류" name="category" value={data.category} onChange={handleChangeValue} required>
                                {genCateRows &&
                                    genCateRows.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                            </MokaInputLabel>
                        </Col>
                        <Col xs={3} className="p-0 d-flex justify-content-center">
                            <MokaInputLabel
                                as="switch"
                                label="사용"
                                labelWidth={40}
                                id="schedule-work-use"
                                name="usedYn"
                                inputProps={{ custom: true, checked: data.usedYn === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2 align-items-center">
                        <Col xs={4} className="p-0 pr-2">
                            <MokaInputLabel
                                label="구분"
                                as="radio"
                                value="S"
                                name="jobType"
                                id="schedule-work-s"
                                onChange={handleChangeValue}
                                inputProps={{ custom: true, label: '스케줄', checked: data.jobType === 'S' ? true : false }}
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <MokaInput
                                as="radio"
                                name="jobType"
                                value="R"
                                id="schedule-work-r"
                                onChange={handleChangeValue}
                                inputProps={{ custom: true, label: '백오피스 예약', checked: data.jobType === 'R' ? true : false }}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={5} className="p-0">
                            {data.jobType === 'S' && (
                                <MokaInputLabel label="주기" as="select" name="period" value={data.period} onChange={handleChangeValue}>
                                    <option value="30">30초</option>
                                    <option value="60">1분</option>
                                    <option value="120">2분</option>
                                    <option value="300">5분</option>
                                    <option value="600">10분</option>
                                    <option value="1200">20분</option>
                                    <option value="1800">30분</option>
                                    <option value="3600">1시간</option>
                                    <option value="43200">12시간</option>
                                    <option value="86400">24시간</option>
                                </MokaInputLabel>
                            )}
                            {data.jobType === 'R' && (
                                <MokaInputLabel label="백오피스 업무" as="select" name="backOffice" value={data.backOffice} onChange={handleChangeValue}>
                                    {boSchjobRows &&
                                        boSchjobRows.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                </MokaInputLabel>
                            )}
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={5} className="p-0">
                            <MokaInputLabel label="전송 타입" as="select" name="sendType" value={data.sendType} onChange={handleChangeValue}>
                                <option value=""></option>
                                <option value="FTP">FTP</option>
                                <option value="ND">네트워크 복사</option>
                            </MokaInputLabel>
                        </Col>
                        {data.sendType === 'FTP' && (
                            <>
                                <Col xs={4} className="p-0 d-flex justify-content-center">
                                    <div style={{ width: 180 }}>
                                        <MokaInputLabel label="FTP\nPORT" name="ftpPort" value={data.ftpPort} onChange={handleChangeValue} />
                                    </div>
                                </Col>
                                <Col xs={3} className="p-0 d-flex justify-content-center">
                                    <div style={{ width: 120 }}>
                                        <MokaInputLabel
                                            label="PASSIVE\n모드"
                                            name="ftpPassive"
                                            as="checkbox"
                                            id="schedule-work-ftpPassive"
                                            inputProps={{ label: '', custom: true, checked: data.ftpPassive === 'Y' }}
                                            onChange={handleChangeValue}
                                        />
                                    </div>
                                </Col>
                            </>
                        )}
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col sm={6} className="p-0">
                            <MokaInputLabel label="배포 서버" as="select" name="serverSeq" value={data.serverSeq} onChange={handleChangeValue}>
                                <option value="0"></option>
                                {deployServerCode &&
                                    deployServerCode.map((s) => (
                                        <option key={s.serverSeq} value={s.serverSeq}>
                                            {s.serverNm}
                                        </option>
                                    ))}
                            </MokaInputLabel>
                        </Col>
                    </Form.Row>
                    <MokaInputLabel
                        label="배포 경로"
                        className="mb-2"
                        name="targetPath"
                        value={data.targetPath}
                        onChange={handleChangeValue}
                        isInvalid={error.targetPath}
                        required
                    />
                    <MokaInputLabel label="패키지명" className="mb-2" name="pkgNm" value={data.pkgNm} onChange={handleChangeValue} isInvalid={error.pkgNm} required />
                    <MokaInputLabel label="호출 URL" className="mb-2" name="callUrl" value={data.callUrl} onChange={handleChangeValue} isInvalid={error.callUrl} required />
                    <MokaInputLabel
                        as="textarea"
                        label="설명"
                        className={jobSeq ? 'mb-2' : 'mb-4'}
                        name="jobDesc"
                        inputProps={{ rows: jobSeq ? 1 : 5 }}
                        value={data.jobDesc}
                        onChange={handleChangeValue}
                        // isInvalid={error.jobDesc}
                        // required
                    />
                    {jobSeq && (
                        <>
                            <MokaInputLabel
                                label="등록정보"
                                name="regInfo"
                                className="mb-2"
                                value={
                                    data.regDt
                                        ? `${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember ? data.regMember.memberNm : ''}${
                                              data.regMember ? `(${data.regMember.memberId})` : ''
                                          }`
                                        : ''
                                }
                                inputProps={{ plaintext: true, readOnly: true }}
                            />
                            <MokaInputLabel
                                label="수정 정보"
                                name="modInfo"
                                className="mb-2"
                                value={
                                    data.modDt
                                        ? `${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember ? data.modMember.memberNm : ''}${
                                              data.modMember ? `(${data.modMember.memberId})` : ''
                                          }`
                                        : ''
                                }
                                inputProps={{ plaintext: true, readOnly: true }}
                            />
                            <MokaInputLabel
                                label="마지막\n실행 정보"
                                name="lastInfo"
                                className="mb-2"
                                // 생성: ${data.create} 배포: ${data.deploy}
                                value={`${moment(data.jobStatus?.lastExecDt).format(DB_DATEFORMAT)}`}
                                inputProps={{ plaintext: true, readOnly: true }}
                            />
                            <Form.Row className="mb-4">
                                <MokaInputLabel label=" " as="none" />
                                <MokaInput
                                    as="textarea"
                                    name="errMgs"
                                    value={data.errMgs ? data.errMgs : ''}
                                    className="custom-scroll resize-none"
                                    readOnly
                                    inputProps={{ rows: 5 }}
                                />
                            </Form.Row>
                        </>
                    )}
                </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center card-footer">
                <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                    {jobSeq ? '수정' : '등록'}
                </Button>
                {jobSeq && (
                    <Button variant="negative" className="mr-1" onClick={handleClickDelete}>
                        삭제
                    </Button>
                )}
                <Button variant="negative" onClick={handleClickCancel}>
                    취소
                </Button>
            </Card.Footer>
        </>
    );
};

export default WorkEdit;
