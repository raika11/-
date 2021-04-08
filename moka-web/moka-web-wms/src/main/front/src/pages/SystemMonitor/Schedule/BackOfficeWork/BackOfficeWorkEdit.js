import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { MokaCard, MokaInputLabel } from '@/components';
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
        history.push(`${match.path}/back-office-work`);
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
        <MokaCard
            title="작업 정보"
            className="flex-fill"
            // bodyClassName="d-flex flex-column"
            footer
            footerButtons={[
                {
                    text: '취소',
                    onClick: handleClickCancel,
                    variant: 'negative',
                },
            ].filter((a) => a)}
        >
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
        </MokaCard>
    );
};

export default BackOfficeWorkEdit;
