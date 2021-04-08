import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInputLabel, MokaInput } from '@/components';
import { SCHEDULE_PERIOD } from '@/constants';
import toast, { messageBox } from '@/utils/toastUtil';
import { saveJob, getDeleteJobList } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록 > 복원 > 등록 모달
 */
const AddJobModal = (props) => {
    const { match, show, onHide, job } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deployServerCode = useSelector((store) => store.schedule.work.deployServerCode);
    const [data, setData] = useState({});

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
     * 저장
     */
    const handleClickSave = () => {
        let temp = {
            ...data,
            ftpPassive: data.sendType === 'FTP' ? data.ftpPassive : 'N',
            period: data.jobType === 'R' ? 0 : data.period,
        };
        dispatch(
            saveJob({
                job: temp,
                jobSeq: Number(data.jobSeq),
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success('삭제된 작업이 복원되었습니다.');
                        handleClickHide();
                        history.push(`${match.path}/work-delete`);
                        dispatch(getDeleteJobList());
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 취소
     */
    const handleClickHide = () => {
        setData({});
        onHide();
    };

    useEffect(() => {
        if (show) {
            setData({ ...job, usedYn: 'Y' });
        }
    }, [show, job]);

    return (
        <MokaModal
            size="md"
            title="작업 등록"
            show={show}
            onHide={handleClickHide}
            width={500}
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickHide },
            ]}
            draggable
        >
            <Form
            //  onSubmit={(e) => e.preventDefault()}
            >
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel as="select" label="분류" name="category" value={data.category} onChange={handleChangeValue} required>
                            {genCateRows &&
                                genCateRows.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </Col>
                    <Col xs={4} className="p-0 d-flex justify-content-center">
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
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            label="구분"
                            as="radio"
                            value="S"
                            name="jobType"
                            id="schedule-work-s"
                            onChange={handleChangeValue}
                            inputProps={{ custom: true, label: '스케줄', checked: data.jobType === 'S' ? true : false }}
                            disabled={true}
                        />
                    </Col>
                    <Col xs={4} className="p-0 d-flex justify-content-center">
                        <div>
                            <MokaInput
                                as="radio"
                                name="jobType"
                                value="R"
                                id="schedule-work-r"
                                onChange={handleChangeValue}
                                inputProps={{ custom: true, label: '백오피스 예약', checked: data.jobType === 'R' ? true : false }}
                                disabled={true}
                            />
                        </div>
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
                        {data.jobType === 'R' && <MokaInputLabel label="백오피스 업무" name="jobCd" value={data.jobCd} onChange={handleChangeValue} />}
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
                                    labelWidth={40}
                                    name="ftpPassive"
                                    className="pl-20"
                                    as="checkbox"
                                    id="delete-work-ftpPassive"
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
                <MokaInputLabel label="작업명" className="mb-2" name="jobNm" value={data.jobNm} onChange={handleChangeValue} />
                <MokaInputLabel label="옵션 파라미터" className="mb-2" name="pkgOpt" value={data.pkgOpt} onChange={handleChangeValue} />
                <MokaInputLabel label="배포 경로" className="mb-2" name="targetPath" value={data.targetPath} onChange={handleChangeValue} />
                <MokaInputLabel label="패키지명" className="mb-2" name="pkgNm" value={data.pkgNm} onChange={handleChangeValue} required />
                <MokaInputLabel as="textarea" label="설명" name="jobDesc" inputProps={{ rows: 5 }} value={data.jobDesc} onChange={handleChangeValue} />
            </Form>
        </MokaModal>
    );
};

export default AddJobModal;
