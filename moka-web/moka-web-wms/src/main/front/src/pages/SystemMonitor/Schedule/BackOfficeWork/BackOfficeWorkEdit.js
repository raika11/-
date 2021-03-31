import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { DB_DATEFORMAT, SCHEDULE_STATUS } from '@/constants';
import { getHistoryJob, clearHistoryJob } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 백오피스 예약작업 정보
 */
const BackOfficeWorkEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const backOfficeJob = useSelector((store) => store.schedule.backOffice.backOfficeJob);
    const [data, setData] = useState({});

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        let findIndex = (status) => SCHEDULE_STATUS.findIndex((s) => s.status === status);
        if (backOfficeJob.seqNo) {
            let targetIndex = findIndex(backOfficeJob.status);
            setData({
                ...backOfficeJob,
                jobDesc: backOfficeJob.jobContent.jobDesc,
                jobNm: backOfficeJob.jobContent.jobNm,
                jobCd: backOfficeJob.jobContent.jobCd,
                reserveDt: backOfficeJob.reserveDt ? moment(backOfficeJob.reserveDt).format(DB_DATEFORMAT) : '',
                startDt: backOfficeJob.startDt ? moment(backOfficeJob.startDt).format(DB_DATEFORMAT) : '',
                endDt: backOfficeJob.endDt ? moment(backOfficeJob.endDt).format(DB_DATEFORMAT) : '',
                status: SCHEDULE_STATUS[targetIndex].statusNm || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backOfficeJob]);

    useEffect(() => {
        if (seqNo) {
            dispatch(getHistoryJob(seqNo));
        } else {
            dispatch(clearHistoryJob());
        }
    }, [dispatch, seqNo]);

    return (
        <>
            <Card.Header>
                <Card.Title as="h2">작업 정보</Card.Title>
            </Card.Header>
            <Card.Body className="custom-scroll" style={{ height: 496 }}>
                <Form>
                    <MokaInputLabel label="작업 설명" className="mb-2" value={data.jobDesc} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="백오피스 업무" className="mb-2" value={data.jobNm} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="예약 일시" className="mb-2" value={data.reserveDt} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="시작 일시" className="mb-2" value={data.startDt} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="종료 일시" className="mb-2" value={data.endDt} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="상태" className="mb-2" value={data.status} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="작업 식별 정보" className="mb-2" value={data.jobCd} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="파라미터" className="custom-scroll resize-none" as="textarea" value={data.paramDesc} inputProps={{ rows: 5, readOnly: true }} />
                </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center card-footer">
                <Button variant="negative" onClick={handleClickCancel}>
                    취소
                </Button>
            </Card.Footer>
        </>
    );
};

export default BackOfficeWorkEdit;
