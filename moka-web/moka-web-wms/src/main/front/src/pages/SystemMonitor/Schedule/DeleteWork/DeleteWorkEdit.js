import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams } from 'react-router-dom';
import { MokaInputLabel } from '@/components';
import { messageBox } from '@/utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import { getDeleteJob } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 삭제 작업 조회
 */
const DeleteWorkEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const deleteJob = useSelector((store) => store.schedule.deleteWork.deleteJob);
    const [data, setData] = useState({});

    /**
     * 복원 버튼
     */
    const handleClickRestore = () => {
        messageBox.confirm('작업을 복원하시겠습니까?', () => {});
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        setData(deleteJob);
    }, [deleteJob]);

    useEffect(() => {
        if (seqNo) {
            dispatch(getDeleteJob(seqNo));
        }
    }, [dispatch, seqNo]);

    return (
        <>
            <Card.Header>
                <Card.Title as="h2">삭제 작업 조회</Card.Title>
            </Card.Header>
            <Card.Body className="custom-scroll" style={{ height: 496 }}>
                <Form className="d-flex flex-column">
                    <Form.Row className="mb-2">
                        <Col xs={4} className="p-0">
                            <MokaInputLabel label="분류" name="category" value={data.category} inputProps={{ readOnly: true }} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={4} className="p-0">
                            <MokaInputLabel label="주기" name="period" value={data.period} inputProps={{ readOnly: true }} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2 align-items-center">
                        <Col xs={4} className="p-0">
                            <MokaInputLabel label="전송 타입" name="sendType" value={data.sendType} inputProps={{ readOnly: true }} />
                        </Col>
                        {data.sendType === 'FTP' && (
                            <>
                                <Col xs={4} className="p-0 d-flex justify-content-center">
                                    <div style={{ width: 180 }}>
                                        <MokaInputLabel label="FTP PORT" name="ftpPort" value={data.ftpPort} inputProps={{ readOnly: true }} />
                                    </div>
                                </Col>
                                <Col xs={4} className="p-0">
                                    <div style={{ width: 120 }}>
                                        <MokaInputLabel
                                            label="PASSIVE 모드"
                                            name="ftpPassive"
                                            as="checkbox"
                                            id="schedule-deleteWork-ftpPassive"
                                            inputProps={{ label: '', custom: true, checked: data.ftpPassive === 'Y', readOnly: true }}
                                        />
                                    </div>
                                </Col>
                            </>
                        )}
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <MokaInputLabel label="배포 서버" name="server" value={data.server} inputProps={{ readOnly: true }} />
                    </Form.Row>
                    {/* <MokaInputLabel label="패키지명" className="mb-2" name="url" value={data.url} inputProps={{ readOnly: true }} /> */}
                    <MokaInputLabel label="호출 URL" className="mb-2" name="callUrl" value={data.callUrl} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="배포 경로" className="mb-2" name="targetPath" value={data.targetPath} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="설명" className="mb-2" name="jobDesc" value={data.jobDesc} inputProps={{ readOnly: true }} />
                    <MokaInputLabel
                        label="삭제 정보"
                        value={`${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember?.memberNm}(${data.regMember?.memberNm})`}
                        inputProps={{ readOnly: true }}
                        onChange={(e) => {
                            console.log(e.target.value);
                        }}
                    />
                </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center card-footer">
                <Button variant="positive" className="mr-1" onClick={handleClickRestore}>
                    복원
                </Button>
                <Button variant="negative" onClick={handleClickCancel}>
                    취소
                </Button>
            </Card.Footer>
        </>
    );
};

export default DeleteWorkEdit;
