import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

moment.locale('ko');

/**
 * 최종 작업 상태를 표시하는 badge
 * 노출 중인 임시저장 데이터가 전송 데이터인지, 임시저장 데이터인지 판단
 */
const StatusBadge = (props) => {
    const { lastPublishDt, lastPublishNm, lastPublishId, lastSaveNm, lastSaveId, lastSaveDt, className } = props;
    const [published, setPublished] = useState(false);

    const popover = (
        <Popover id="popover-status-badge">
            <Popover.Content>
                <span className="font-weight-bold">{published ? `전송 ${lastPublishNm}(${lastPublishId})` : `임시 ${lastSaveNm}(${lastSaveId})`}</span>
                <br />
                <span>{published ? lastPublishDt : lastSaveDt}</span>
            </Popover.Content>
        </Popover>
    );

    useEffect(() => {
        const pd = moment(lastPublishDt, DB_DATEFORMAT);
        const sd = moment(lastSaveDt, DB_DATEFORMAT);

        // 전송시간 > 임시저장시간이면 전송된 상태 (반드시 임시저장 후 전송해야만 하기 때문에)
        if (pd.isAfter(sd)) {
            setPublished(true);
        } else {
            setPublished(false);
        }
    }, [lastPublishDt, lastSaveDt]);

    return (
        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
            <Badge variant={published ? 'info' : 'gray-900'} className={className}>
                {published ? '전송' : '임시'}
            </Badge>
        </OverlayTrigger>
    );
};

export default StatusBadge;
