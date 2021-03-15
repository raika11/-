import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInputLabel, MokaInput } from '@/components';
import toast, { messageBox } from '@/utils/toastUtil';
import { saveJob } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록 > 복원 > 등록 모달
 */
const AddJobModal = (props) => {
    const { show, onHide, job } = props;
    const dispatch = useDispatch();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const boSchjobRows = useSelector((store) => store.codeMgt.boSchjobRows);
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
                        toast.success(header.message);
                        handleClickHide();
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
                                <div style={{ width: 110 }}>
                                    <MokaInputLabel label="FTP\nPORT" name="ftpPort" labelWidth={40} value={data.ftpPort} onChange={handleChangeValue} />
                                </div>
                            </Col>
                            <Col xs={3} className="p-0 d-flex justify-content-center">
                                <div style={{ width: 100 }}>
                                    <MokaInputLabel
                                        label="PASSIVE\n모드"
                                        labelWidth={40}
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
                <MokaInputLabel label="배포 경로" className="mb-2" name="targetPath" value={data.targetPath} onChange={handleChangeValue} />
                <MokaInputLabel label="패키지명" className="mb-2" name="pkgNm" value={data.pkgNm} onChange={handleChangeValue} required />
                <MokaInputLabel label="호출 URL" className="mb-2" name="callUrl" value={data.callUrl} onChange={handleChangeValue} required />
                <MokaInputLabel as="textarea" label="설명" name="jobDesc" inputProps={{ rows: 5 }} value={data.jobDesc} onChange={handleChangeValue} />
            </Form>
        </MokaModal>
    );
};

export default AddJobModal;
