import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams } from 'react-router-dom';
import { MokaInput, MokaInputLabel } from '@/components';
import { messageBox } from '@/utils/toastUtil';
import { DB_DATEFORMAT, SCHEDULE_PERIOD } from '@/constants';
import { getDeleteJob, clearDeleteJob } from '@/store/schedule';
import AddJobModal from '../modals/AddJobModal';

/**
 * 스케줄 서버 관리 > 삭제 작업 조회
 */
const DeleteWorkEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { jobSeq } = useParams();
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const deleteJob = useSelector((store) => store.schedule.deleteWork.deleteJob);
    const [data, setData] = useState({});
    const [addJobModal, setAddJobModal] = useState(false);

    /**
     * 복원 버튼
     */
    const handleClickRestore = () => {
        messageBox.confirm(
            '작업을 복원하시겠습니까?',
            () => {
                setAddJobModal(true);
            },
            () => {},
        );
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        // 카테고리, 주기 데이터 매핑
        if (genCateRows && SCHEDULE_PERIOD) {
            let findCateIndex = genCateRows.findIndex((c) => c.id === deleteJob.category);
            let findPeriodIndex = SCHEDULE_PERIOD.findIndex((p) => p.period === deleteJob.period);
            let categoryNm, periodNm;

            if (findCateIndex > -1) {
                categoryNm = genCateRows[findCateIndex].name;
            } else {
                categoryNm = deleteJob.category;
            }

            if (findPeriodIndex > -1) {
                periodNm = SCHEDULE_PERIOD[findPeriodIndex].periodNm;
            } else {
                periodNm = deleteJob.period;
            }

            let nd = {
                ...deleteJob,
                category: categoryNm,
                period: periodNm,
            };
            setData(nd);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteJob, genCateRows, SCHEDULE_PERIOD]);

    useEffect(() => {
        if (jobSeq) {
            dispatch(getDeleteJob(jobSeq));
        } else {
            dispatch(clearDeleteJob());
        }
    }, [dispatch, jobSeq]);

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
                    <Form.Row className="mb-2 align-items-center">
                        <Col xs={4} className="p-0 pr-2">
                            <MokaInputLabel
                                label="구분"
                                as="radio"
                                value="S"
                                name="jobType"
                                id="schedule-work-s"
                                inputProps={{ custom: true, label: '스케줄', checked: data.jobType === 'S' ? true : false }}
                                disabled={true}
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <div>
                                <MokaInput
                                    as="radio"
                                    name="jobType"
                                    value="R"
                                    id="schedule-work-r"
                                    inputProps={{ custom: true, label: '백오피스 예약', checked: data.jobType === 'R' ? true : false }}
                                    disabled={true}
                                />
                            </div>
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
                    <MokaInputLabel label="작업명" className="mb-2" name="jobNm" value={data.jobNm} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="옵션 파라미터" className="mb-2" name="pkgOpt" value={data.pkgOpt} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="배포 경로" className="mb-2" name="targetPath" value={data.targetPath} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="패키지명" className="mb-2" name="pkgNm" value={data.pkgNm} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="설명" className="mb-2" name="jobDesc" value={data.jobDesc} inputProps={{ readOnly: true }} />
                    <MokaInputLabel
                        label="삭제 정보"
                        value={
                            data.modDt
                                ? `${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember?.memberNm || ''} ${data.modMember?.memberId ? `(${data.modMember?.memberId})` : ''}`
                                : ''
                        }
                        inputProps={{ readOnly: true }}
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
            <AddJobModal match={match} show={addJobModal} onHide={() => setAddJobModal(false)} job={deleteJob} />
        </>
    );
};

export default DeleteWorkEdit;
