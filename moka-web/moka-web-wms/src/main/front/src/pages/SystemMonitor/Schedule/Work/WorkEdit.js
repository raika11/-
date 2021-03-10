import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams } from 'react-router-dom';
import { MokaInput, MokaInputLabel } from '@/components';
import { initialState, getJob, clearJob } from '@/store/schedule';
import { DB_DATEFORMAT } from '@/constants';

/**
 * 스케줄 서버 관리 > 작업 목록 등록, 수정
 */
const WorkEdit = ({ match }) => {
    const history = useHistory();
    const { jobSeq } = useParams();
    const dispatch = useDispatch();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const job = useSelector((store) => store.schedule.work.job);
    const [data, setData] = useState(initialState.work.job);

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
        setData(job);
    }, [job]);

    return (
        <>
            <h2 style={{ marginBottom: '20px' }}>{jobSeq ? '작업 수정' : '작업 등록'}</h2>
            <Form>
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel as="select" className="mr-2" label="분류" name="category" value={data.category} onChange={handleChangeValue}>
                        <option value="">전체</option>
                        {genCateRows &&
                            genCateRows.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                    </MokaInputLabel>
                    <MokaInputLabel
                        as="switch"
                        label="사용"
                        id="schedule-work-use"
                        name="usedYn"
                        inputProps={{ custom: true, checked: data.usedYn === 'Y' }}
                        onChange={handleChangeValue}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel label="주기" as="select" name="period" value={data.period} onChange={handleChangeValue}>
                        <option value="">주기 전체</option>
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
                </Form.Row>
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel
                        label="전송 타입"
                        as="select"
                        className={data.sendType === 'FTP' ? 'mr-3' : null}
                        name="sendType"
                        value={data.sendType}
                        onChange={handleChangeValue}
                    >
                        <option value="">전체</option>
                        <option value="FTP">FTP</option>
                        <option value="ND">네트워크 복사</option>
                    </MokaInputLabel>
                    {data.sendType === 'FTP' && (
                        <>
                            <Col sm={4}>
                                <MokaInputLabel label="FTP\nPORT" name="ftpPort" className="mr-2" value={data.ftpPort} onChange={handleChangeValue} />
                            </Col>
                            <MokaInputLabel
                                label="PASSIVE\n모드"
                                name="ftpPassive"
                                as="checkbox"
                                id="schedule-work-ftpPassive"
                                inputProps={{ label: '', custom: true, checked: data.ftpPassive === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </>
                    )}
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel label="배포 서버" as="select" name="serverSeq" value={data.serverSeq} onChange={handleChangeValue}>
                        <option value="">전체</option>
                        {deployServerCode &&
                            deployServerCode.map((s) => (
                                <option key={s.serverSeq} value={s.serverSeq}>
                                    {s.serverNm}
                                </option>
                            ))}
                    </MokaInputLabel>
                </Form.Row>
                <MokaInputLabel label="배포 경로" className="mb-2" name="targetPath" value={data.targetPath} onChange={handleChangeValue} />
                <MokaInputLabel label="패키지명" className="mb-2" name="pkgNm" value={data.targetPath} onChange={handleChangeValue} required />
                <MokaInputLabel label="호출 URL" className="mb-2" name="callUrl" value={data.callUrl} onChange={handleChangeValue} />
                <MokaInputLabel
                    as="textarea"
                    label="설명"
                    className={jobSeq ? 'mb-2' : 'mb-4'}
                    name="jobDesc"
                    inputProps={{ rows: jobSeq ? 1 : 5 }}
                    value={data.jobDesc}
                    onChange={handleChangeValue}
                />
                {jobSeq && (
                    <>
                        <MokaInputLabel
                            label="등록정보"
                            name="regInfo"
                            className="mb-2"
                            value={data.regDt ? `${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember?.memberNm}(${data.regMember?.memberId})` : ''}
                            inputProps={{ plaintext: true, readOnly: true }}
                        />
                        <MokaInputLabel
                            label="수정 정보"
                            name="modInfo"
                            className="mb-2"
                            value={data.modDt ? `${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember?.memberNm}(${data.modMember?.memberId})` : ''}
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
                            <MokaInput as="textarea" name="errMgs" value={data.errMgs ? data.errMgs : ''} className="custom-scroll resize-none" readOnly inputProps={{ rows: 5 }} />
                        </Form.Row>
                    </>
                )}
                <div className="d-flex justify-content-center">
                    <Button variant="positive" className="mr-1">
                        {jobSeq ? '수정' : '등록'}
                    </Button>
                    {jobSeq && (
                        <Button variant="negative" className="mr-1">
                            삭제
                        </Button>
                    )}
                    <Button variant="negative" onClick={handleClickCancel}>
                        취소
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default WorkEdit;
