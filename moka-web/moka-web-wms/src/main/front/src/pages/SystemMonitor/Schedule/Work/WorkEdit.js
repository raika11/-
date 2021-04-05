import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel } from '@/components';
import { DB_DATEFORMAT, SCHEDULE_PERIOD } from '@/constants';
import toast, { messageBox } from '@/utils/toastUtil';
import { invalidListToError } from '@/utils/convertUtil';
import { initialState, getJob, getJobCdCheck, clearJob, saveJob, deleteJob, getDeleteJobList } from '@/store/schedule';
import JobContentModal from '../modals/JobContentModal';
import { REQUIRED_REGEX } from '@/utils/regexUtil';

/**
 * 스케줄 서버 관리 > 작업 목록 편집(등록, 수정)
 */
const WorkEdit = ({ match }) => {
    const history = useHistory();
    const { jobSeq } = useParams();
    const dispatch = useDispatch();

    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const job = useSelector((store) => store.schedule.work.job);
    const [data, setData] = useState(initialState.work.job);
    const [error, setError] = useState({});
    const [contentModal, setContentModal] = useState(false);
    const [disabledBtn, setDisabledBtn] = useState(false);

    /**
     * input value
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setData({ ...data, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'ftpPassive') {
            setData({ ...data, ftpPassive: checked ? 'Y' : 'N' });
        } else if (name === 'jobCd') {
            setData({ ...data, jobCd: value });
            setDisabledBtn(false);
        } else {
            setData({ ...data, [name]: value });
        }
        setError({});
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

        if (!obj.pkgNm || !REQUIRED_REGEX.test(obj.pkgNm)) {
            errList.push({
                field: 'pkgNm',
                reason: '패키지 명을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        if (obj.jobType === 'R') {
            if (!obj.jobCd || !REQUIRED_REGEX.test(obj.jobCd)) {
                errList.push({
                    field: 'jobCd',
                    reason: '백오피스 업무 코드를 입력하세요',
                });
                isInvalid = isInvalid || true;
            }

            if (!obj.jobNm || !REQUIRED_REGEX.test(obj.jobNm)) {
                errList.push({
                    field: 'jobNm',
                    reason: '작업명을 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
        }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    // console.log(error);

    /**
     * 중복 체크
     */
    const handleClickDuplicate = () => {
        let isInvalid = false,
            errList = [];

        if (!/^[A-Za-z0-9_]+$/.test(data.jobCd)) {
            errList.push({
                field: 'jobCd',
                reason: '백오피스 업무 코드는 \n영문, 숫자, 특수문자 _만 사용할 수 있습니다.',
            });
            isInvalid = isInvalid || true;
        } else {
            dispatch(
                getJobCdCheck({
                    jobCd: data.jobCd,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            if (body.duplicated) {
                                messageBox.alert('입력하신 백오피스 업무 코드가 중복됩니다.\n확인하신 후 다시 입력해 주세요');
                            } else {
                                toast.success('사용할 수 있는 업무 코드입니다.');
                                setDisabledBtn(true);
                            }
                        }
                    },
                }),
            );
        }

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
        const save = () => {
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
            } else {
            }
        };

        if (data.jobType === 'R') {
            if (!disabledBtn) {
                messageBox.alert('백오피스 업무 코드 중복 체크를 해주세요');
            } else {
                save();
            }
        } else {
            save();
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
                                history.push(`${match.path}/work`);
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
        history.push(`${match.path}/work-list`);
    };

    useEffect(() => {
        // 데이터 조회 액션
        if (jobSeq) {
            dispatch(getJob(jobSeq));
            setDisabledBtn(true);
        } else {
            dispatch(clearJob());
            setDisabledBtn(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobSeq]);

    useEffect(() => {
        // 스토어의 job 데이터를 로컬 state에 셋팅
        setData(job);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job]);

    useEffect(() => {
        // 수정 화면에서 입력한 jobCd가 조회된 jobCd와 같으면 중복 검사를 하지 않는다
        if (jobSeq && job.jobCd === data.jobCd) {
            setDisabledBtn(true);
        }
    }, [jobSeq, job.jobCd, data.jobCd]);

    useEffect(() => {
        let errorMessage = [];
        if (Object.keys(error).length > 0) {
            Object.keys(error).forEach((i) => {
                if (i.indexOf('Message') > -1) {
                    errorMessage.push(i);
                }
            });
            messageBox.alert(error[errorMessage[0]]);
        }
    }, [error]);

    return (
        <MokaCard
            title={jobSeq ? '작업 수정' : '작업 등록'}
            className="flex-fill"
            bodyClassName="d-flex flex-column"
            footer
            footerButtons={[
                jobSeq &&
                    data.jobType === 'S' && {
                        text: '재실행',
                        onClick: handleClickExecute,
                        variant: 'positive',
                        className: 'mr-1',
                    },
                {
                    text: jobSeq ? '수정' : '저장',
                    onClick: handleClickSave,
                    variant: 'positive',
                    className: 'mr-1',
                },
                jobSeq && {
                    text: '삭제',
                    onClick: handleClickDelete,
                    variant: 'negative',
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    onClick: handleClickCancel,
                    variant: 'negative',
                },
            ].filter((a) => a)}
        >
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
                <Form.Row className="mb-2" style={{ maxHeight: 31 }}>
                    <Col xs={5} className={data.jobType === 'R' ? 'p-0 mr-2' : 'p-0'}>
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
                            <MokaInputLabel label="백오피스 업무" name="jobCd" value={data.jobCd} onChange={handleChangeValue} isInvalid={error.jobCd} />
                        )}
                    </Col>
                    {data.jobType === 'R' && (
                        <Button variant="outline-table-btn" onClick={handleClickDuplicate} disabled={disabledBtn}>
                            중복 확인
                        </Button>
                    )}
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
                <MokaInputLabel label="작업명" className="mb-2" name="jobNm" value={data.jobNm} onChange={handleChangeValue} isInvalid={error.jobNm} />
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
            <JobContentModal content={data.jobStatus?.content} show={contentModal} onHide={() => setContentModal(false)} />
        </MokaCard>
    );
};

export default WorkEdit;
