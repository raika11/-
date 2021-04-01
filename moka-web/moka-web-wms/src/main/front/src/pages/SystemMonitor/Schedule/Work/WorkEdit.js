import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';
import { DB_DATEFORMAT, SCHEDULE_PERIOD } from '@/constants';
import toast, { messageBox } from '@/utils/toastUtil';
import { invalidListToError } from '@/utils/convertUtil';
import { initialState, getJob, clearJob, saveJob, deleteJob, getDeleteJobList } from '@/store/schedule';
import JobContentModal from '../modals/JobContentModal';

/**
 * 스케줄 서버 관리 > 작업 목록 편집(등록, 수정)
 */
const WorkEdit = ({ match }) => {
    const history = useHistory();
    const { jobSeq } = useParams();
    const dispatch = useDispatch();
    const jobCode = useSelector((store) => store.schedule.backOffice.jobCode);
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const job = useSelector((store) => store.schedule.work.job);
    const [data, setData] = useState(initialState.work.job);
    const [error, setError] = useState({});
    const [contentModal, setContentModal] = useState(false);

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

        // if (!obj.targetPath) {
        //     errList.push({
        //         field: 'targetPath',
        //         reason: '배포 경로를 입력하세요',
        //     });
        //     isInvalid = isInvalid || true;
        // }

        if (!obj.pkgNm) {
            errList.push({
                field: 'pkgNm',
                reason: '패키지 명을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        // if (obj.jobType === 'R') {
        //     if (!obj.jobCd) {
        //         errList.push({
        //             field: 'jobCd',
        //             reason: '백오피스 업무를 입력하세요',
        //         });
        //         isInvalid = isInvalid || true;
        //     }
        // }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 생성 내용 보기
     */
    const handleClickInfo = () => {
        if (data.jobStatus?.content) {
            setContentModal(true);
        } else {
            messageBox.alert('생성된 내용이 존재하지 않습니다.');
        }
    };

    /**
     * 재실행
     */
    const handleClickExecute = () => {};

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (validate(data)) {
            let temp = {
                ...data,
                ftpPassive: data.sendType === 'FTP' ? data.ftpPassive : 'N',
                period: data.jobType === 'R' ? 0 : data.period,
            };
            dispatch(
                saveJob({
                    job: temp,
                    jobSeq: jobSeq ? Number(jobSeq) : null,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/work-list/${body.jobSeq}`);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            '작업을 삭제하시겠습니까?',
            () =>
                dispatch(
                    deleteJob({
                        jobSeq: Number(jobSeq),
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success('삭제되었습니다.');
                                dispatch(getDeleteJobList());
                                history.push(`${match.path}`);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                ),
            () => {},
        );
    };

    /**
     * 취소
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
        // 스토어의 job 데이터를 로컬 state에 셋팅
        setData(job);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job]);

    return (
        <>
            <Card.Header>
                <Card.Title as="h2">{jobSeq ? '작업 수정' : '작업 등록'}</Card.Title>
            </Card.Header>
            <Card.Body className="custom-scroll" style={{ height: 496, maxWidth: 640 }}>
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
                                disabled={jobSeq ? true : false}
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
                                disabled={jobSeq ? true : false}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={5} className="p-0">
                            {data.jobType === 'S' && (
                                <MokaInputLabel label="주기" as="select" name="period" value={data.period} onChange={handleChangeValue}>
                                    {SCHEDULE_PERIOD.filter((p) => p.period !== 0).map((p) => (
                                        <option key={p.period} value={p.period}>
                                            {p.periodNm}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            )}
                            {data.jobType === 'R' && (
                                // <MokaInputLabel label="백오피스 업무" name="jobCd" value={data.jobCd} onChange={handleChangeValue} />
                                <MokaInputLabel label="백오피스 업무" as="select" name="jobSeq" value={data.jobSeq} onChange={handleChangeValue}>
                                    <option value="">업무 전체</option>
                                    {jobCode &&
                                        jobCode.map((j) => (
                                            <option key={j.jobSeq} value={j.jobSeq}>
                                                {j.jobNm}
                                            </option>
                                        ))}
                                </MokaInputLabel>
                            )}
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2" style={{ maxHeight: 31 }}>
                        <Col xs={5} className="p-0">
                            <MokaInputLabel label="전송 타입" as="select" name="sendType" value={data.sendType} onChange={handleChangeValue}>
                                <option value=""></option>
                                <option value="FTP">FTP</option>
                                <option value="ND">네트워크 복사</option>
                            </MokaInputLabel>
                        </Col>
                        {data.sendType === 'FTP' && (
                            <>
                                <Col xs={3} className="p-0">
                                    <MokaInputLabel label="FTP PORT" className="pl-20" labelWidth={40} name="ftp\nPort" value={data.ftpPort} onChange={handleChangeValue} />
                                </Col>
                                <Col xs={3} className="p-0">
                                    <MokaInputLabel
                                        label="PASSIVE\n모드"
                                        name="ftpPassive"
                                        className="pl-20"
                                        as="checkbox"
                                        id="schedule-work-ftpPassive"
                                        inputProps={{ label: '', custom: true, checked: data.ftpPassive === 'Y' }}
                                        onChange={handleChangeValue}
                                    />
                                </Col>
                            </>
                        )}
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col sm={6} className="p-0">
                            <MokaInputLabel label="배포 서버" as="select" name="serverSeq" value={data.serverSeq} onChange={handleChangeValue}>
                                <option value=""></option>
                                {deployServerCode &&
                                    deployServerCode.map((s) => (
                                        <option key={s.serverSeq} value={s.serverSeq}>
                                            {s.serverNm}
                                        </option>
                                    ))}
                            </MokaInputLabel>
                        </Col>
                    </Form.Row>
                    <MokaInputLabel label="작업명" className="mb-2" name="jobNm" value={data.jobNm} onChange={handleChangeValue} />
                    <MokaInputLabel label="옵션 파라미터" className="mb-2" name="pkgOpt" value={data.pkgOpt} onChange={handleChangeValue} />
                    <MokaInputLabel label="배포 경로" className="mb-2" name="targetPath" value={data.targetPath} onChange={handleChangeValue} />
                    <MokaInputLabel label="패키지명" className="mb-2" name="pkgNm" value={data.pkgNm} onChange={handleChangeValue} isInvalid={error.pkgNm} required />
                    <MokaInputLabel
                        as="textarea"
                        label="설명"
                        className={jobSeq && 'mb-2'}
                        name="jobDesc"
                        inputProps={{ rows: jobSeq ? 3 : 5 }}
                        value={data.jobDesc}
                        onChange={handleChangeValue}
                    />
                    {jobSeq && (
                        <>
                            <MokaInputLabel
                                label="등록정보"
                                name="regInfo"
                                className="mb-2"
                                value={
                                    data.regDt
                                        ? `${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember?.memberNm || ''} ${
                                              data.regMember?.memberId ? `(${data.regMember?.memberId})` : ''
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
                                        ? `${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember?.memberNm || ''} ${
                                              data.modMember?.memberId ? `(${data.modMember?.memberId})` : ''
                                          }`
                                        : ''
                                }
                                inputProps={{ plaintext: true, readOnly: true }}
                            />
                            <Form.Row className="mb-2 align-items-center justify-content-between">
                                <MokaInputLabel
                                    label="마지막\n실행 정보"
                                    name="lastInfo"
                                    className="flex-fill"
                                    value={
                                        data.jobStatus
                                            ? `${data.jobStatus.genResult && `생성: ${data.jobStatus.genResult}/${data.jobStatus.genExecTime}`}   ${
                                                  data.jobStatus.sendResult && `배포: ${data.jobStatus.sendResult}/${data.jobStatus.sendExecTime}`
                                              }   ${moment(data.jobStatus.lastExecDt).format(DB_DATEFORMAT)}`
                                            : ''
                                    }
                                    inputProps={{ plaintext: true, readOnly: true }}
                                />
                                {data.jobType === 'S' && (
                                    <Button variant="outline-neutral" size="sm" onClick={handleClickInfo}>
                                        생성 내용 보기
                                    </Button>
                                )}
                            </Form.Row>
                            <Form.Row>
                                <MokaInputLabel label=" " as="none" />
                                <MokaInput as="textarea" value={data.jobStatus?.errMgs || ''} className="custom-scroll resize-none" readOnly inputProps={{ rows: 5 }} />
                            </Form.Row>
                        </>
                    )}
                </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center card-footer">
                {jobSeq && data.jobType === 'S' && (
                    <Button variant="positive" className="mr-1" onClick={handleClickExecute}>
                        재실행
                    </Button>
                )}
                <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                    {jobSeq ? '수정' : '저장'}
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
            <JobContentModal content={data.jobStatus?.content} show={contentModal} onHide={() => setContentModal(false)} />
        </>
    );
};

export default WorkEdit;
